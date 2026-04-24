from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
import random
import time
pending_requests={}
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vault = {
    "V123": {
        "AgeOver18": True
    }
}

@app.get("/")
def home():
    return {"message":"Vault Running"}

@app.post("/verify")
def verify(data: dict):

    vault_id = data["vault_id"]
    attribute = data["attribute"]

    if vault[vault_id].get(attribute):
        return {"verified":True}

    return {
        "verified":False,
        "reason_code":"ATTRIBUTE_NOT_MET"
    }
@app.post("/request-consent")
def request_consent(data: dict):

    vault_id = data["vault_id"]

    code = str(random.randint(100000,999999))

    pending_requests[vault_id] = {
        "code": code,
        "expires": time.time() + 60
    }

    return {
        "message":"Consent request sent",
        "approval_code": code
    }    
@app.post("/approve")
def approve(data: dict):

    vault_id = data["vault_id"]
    entered_code = data["code"]

    req = pending_requests.get(vault_id)

    if not req:
        return {
            "verified":False,
            "reason":"NO_ACTIVE_REQUEST"
        }

    if time.time() > req["expires"]:
        return {
            "verified":False,
            "reason":"CODE_EXPIRED"
        }

    if entered_code != req["code"]:
        return {
            "verified":False,
            "reason":"CONSENT_DENIED"
        }

    del pending_requests[vault_id]

    return {
        "verified":True
    }    