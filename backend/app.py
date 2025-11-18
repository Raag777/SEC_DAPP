from flask import send_file, jsonify, request
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from datetime import datetime
import io
import os
import time
import json
from flask import Flask
from flask_cors import CORS
from web3 import Web3
from dotenv import load_dotenv

# ================================================================
# 🔹 Load ENV + chain setup
# ================================================================
load_dotenv()

GANACHE_RPC = os.getenv("GANACHE_RPC", "http://127.0.0.1:7545")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
OWNER_PRIVATE_KEY = os.getenv("OWNER_PRIVATE_KEY")
OWNER_ADDRESS = os.getenv("OWNER_ADDRESS")
CHAIN_ID = int(os.getenv("CHAIN_ID", "1337"))

w3 = Web3(Web3.HTTPProvider(GANACHE_RPC))
connected_to_rpc = w3.is_connected()
print("Connected to Ganache:", connected_to_rpc)

abi = None
if os.path.exists("contract_abi.json"):
    with open("contract_abi.json", "r") as f:
        abi = json.load(f)

contract = None
if abi and CONTRACT_ADDRESS and connected_to_rpc:
    try:
        contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)
        print("Contract loaded:", CONTRACT_ADDRESS)
    except Exception as e:
        print("⚠️ Contract init failed:", e)

# ================================================================
# 🔹 Flask setup
# ================================================================
app = Flask(__name__)
CORS(app)

CERT_FILE = "certificates.json"
USERS_FILE = "users.json"

# ================================================================
# 🔹 Helpers
# ================================================================
def load_local_certs():
    if not os.path.exists(CERT_FILE):
        return []
    try:
        with open(CERT_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def save_certificate_local(cert):
    certs = load_local_certs()
    certs.append(cert)
    with open(CERT_FILE, "w") as f:
        json.dump(certs, f, indent=4)

def normalize_certificate(cert):
    energy_kwh = cert.get("energyKwh")
    if energy_kwh is None:
        energy_wh = cert.get("energyWh", cert.get("energyProduced", 0))
        energy_kwh = float(energy_wh) / 1000.0
    timestamp = int(cert["timestamp"])
    return {
        "id": int(cert["id"]),
        "owner": cert["owner"],
        "energyKwh": round(float(energy_kwh), 3),
        "energyWh": int(round(float(energy_kwh) * 1000)),
        "timestamp": timestamp,
        "timestampHuman": datetime.utcfromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S"),
        "txHash": cert.get("txHash")
    }

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

# ================================================================
# 🔹 USER REGISTER / ROLE CHECK ROUTES
# ================================================================
@app.route("/register", methods=["POST"])
def register():
    """Register wallet to role mapping"""
    data = request.json or {}
    addr = data.get("address")
    role = data.get("role", "").strip().lower()
    if not addr or role not in ("admin", "producer", "company"):
        return jsonify({"error": "Invalid params"}), 400

    users = load_users()
    users[addr.lower()] = role
    save_users(users)
    return jsonify({"success": True, "role": role})

@app.route("/userRole/<string:address>", methods=["GET"])
def user_role(address):
    users = load_users()
    role = users.get(address.lower(), None)
    return jsonify({"role": role})

# ================================================================
# 🔹 Mint Certificate (via Blockchain or local fallback)
# ================================================================
@app.route("/mint", methods=["POST"])
def mint():
    try:
        data = request.json or {}
        to = Web3.to_checksum_address(data["to"])
        energy_kwh = float(data.get("energyKwh", 0))

        if energy_kwh <= 0:
            return jsonify({"error": "Energy must be > 0"}), 400

        tx_hash, cert_id = None, None
        timestamp = int(time.time())

        if contract and connected_to_rpc:
            nonce = w3.eth.get_transaction_count(OWNER_ADDRESS)
            tx = contract.functions.issueCertificate(to, int(energy_kwh)).build_transaction({
                "from": OWNER_ADDRESS,
                "nonce": nonce,
                "gas": 300000,
                "gasPrice": w3.to_wei(20, "gwei"),
                "chainId": CHAIN_ID,
            })
            signed = w3.eth.account.sign_transaction(tx, OWNER_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            logs = contract.events.CertificateIssued().process_receipt(receipt)
            if logs:
                event = logs[0]["args"]
                cert_id = int(event["id"])
                timestamp = int(event["timestamp"])
        else:
            print("⚠ No RPC — fallback to local")

        if not cert_id:
            local = load_local_certs()
            cert_id = max([c["id"] for c in local], default=0) + 1

        cert = {
            "id": cert_id,
            "owner": to,
            "energyKwh": energy_kwh,
            "timestamp": timestamp,
            "txHash": tx_hash.hex() if tx_hash else None,
        }
        save_certificate_local(cert)

        return jsonify({"success": True, "certificate": normalize_certificate(cert)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ================================================================
# 🔹 Public routes: certificates + tokens
# ================================================================
@app.route("/certificates.json", methods=["GET"])
def certificates_json():
    return jsonify([normalize_certificate(c) for c in load_local_certs()])

@app.route("/tokensOfOwner/<string:address>", methods=["GET"])
def tokens_of_owner(address):
    addr = address.lower()
    certs = load_local_certs()
    tokens = [c for c in certs if c.get("owner", "").lower() == addr]
    return jsonify({"tokens": tokens, "count": len(tokens)})

@app.route("/getSEC/<int:cert_id>", methods=["GET"])
def get_sec(cert_id):
    certs = load_local_certs()
    for cert in certs:
        if int(cert["id"]) == cert_id:
            return jsonify(normalize_certificate(cert))
    return jsonify({"error": "Not found"}), 404

# ================================================================
# 🔹 PDF generator
# ================================================================
@app.route("/download_certificate/<int:cert_id>", methods=["GET"])
def download_certificate(cert_id):
    resp = get_sec(cert_id)
    data = resp.get_json()
    if "error" in data:
        return resp

    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)

    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(140, 800, "🌞 Solar Energy Certificate")
    pdf.setFont("Helvetica", 14)
    pdf.drawString(80, 770, f"ID: {data['id']}")
    pdf.drawString(80, 750, f"Owner: {data['owner']}")
    pdf.drawString(80, 730, f"Energy: {data['energyKwh']} kWh")
    pdf.drawString(80, 710, f"Issued: {data['timestampHuman']} UTC")
    pdf.drawString(80, 680, "Verified by SEC DApp")

    pdf.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"SEC_{cert_id}.pdf",
        mimetype="application/pdf"
    )

# ================================================================
# 🔹 Run Server
# ================================================================
if __name__ == "__main__":
    print("🚀 Backend running at http://localhost:5000")
    app.run(port=5000, debug=True)
