import { useEffect, useState } from "react";
import Loki from 'lokijs';
import { Vote } from "@/types/localTypes";

const useDB = () => {
  const [ db, setDB ] = useState<Loki | null>(null);
  const [ faceCollection, setFaceCollection ] = 
    useState<Loki.Collection<Float32Array> | null>(null);
  const [ voteCollection, setVoteCollection ] = 
    useState<Loki.Collection<Vote> | null>(null);

  useEffect(() => {
    try {
      const dbInstance = new Loki('1.json', {
        persistenceMethod: 'fs'
      });

      // load database if it exists
      dbInstance.loadDatabase({}, () => {
        // create or get collection of documents
        const faces = 
          dbInstance.getCollection<Float32Array>('documents') || 
          dbInstance.addCollection('documents');
        const votes = 
          dbInstance.getCollection<Vote>('votes') || 
          dbInstance.addCollection('votes');
        setDB(dbInstance);
        setFaceCollection(faces);
        setVoteCollection(votes);
      });


    } catch (error) {
      console.error('useDB error', error);
    }
  }, []);

  const getAllFaces = () => {
    if (!faceCollection) {
      return [];
    };
    return faceCollection.find();
  };

  const getAllVotes = () => {
    if (!voteCollection) {
      return [];
    }
    return voteCollection.find();
  }

  const addFaces = (face: Float32Array) => {
    if (!db || !faceCollection) {
      throw new Error('No database or collection');
    }
    const response = faceCollection.insert(face);
    db.saveDatabase();
    return response;
  };

  const addVotes = (vote: Vote) => {
    if (!db || !voteCollection) {
      throw new Error('No database or collection');
    }
    const response = voteCollection.insert(vote);
    db.saveDatabase();
    return response;
  };

  const deleteAllFromDB = () => {
    if (!db || !voteCollection || !faceCollection) {
      throw new Error('No database or collection');
    }
    // tyhjennetaan collectionia ja tallennetaan tulokset
    faceCollection.clear();
    voteCollection.clear();
    db.saveDatabase();
  };

  return { addFaces, addVotes, getAllFaces, getAllVotes, deleteAllFromDB };
};

export { useDB };

