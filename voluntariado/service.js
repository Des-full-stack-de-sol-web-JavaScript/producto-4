import { getDB } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

function getCollection() {
    return getDB().collection('voluntariados');
}