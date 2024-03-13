import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi

load_dotenv()

client = AsyncIOMotorClient(os.getenv('MONGODB_URL'), server_api=ServerApi('1'))
db = client.get_database(os.getenv('DATABASE'))
token_collection = db.get_collection(os.getenv('COLLECTION'))