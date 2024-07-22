"use client"
import React, { useState } from 'react';
import axios from 'axios';

interface EdgeStream {
  id: string;
  ip: string;
  stream_key: string | null;
  state: string;
  stakes: number;
  geo: [number, number];
}

interface StreamDetails {
  id: string;
  name: string;
  status: string;
  update_time: string;
  playback_uri: string | null;
  player_uri: string | null;
  stream_key: string | null;
  server_url: string | null;
}

const LiveStreamComponent: React.FC = () => {
  const [streamId, setStreamId] = useState<string>('');
  const [streamDetails, setStreamDetails] = useState<StreamDetails | null>(null);
  const [edgeStreams, setEdgeStreams] = useState<EdgeStream[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const createStream = async () => {
    try {
      const response = await axios.post('https://api.thetavideoapi.com/stream', {
        name: 'demo'
      }, {
        headers: {
          'x-tva-sa-id': 'srvacc_2wtggp69w8bnpy6g4mrzb742a',
          'x-tva-sa-secret': 'r6rh6t2s6wppbtscvy1hxzh0fg626p4b',
          'Content-Type': 'application/json'
        }
      });
      setStreamId(response.data.body.id);
      setProgress(25); // Update progress
    } catch (error) {
      console.error('Error creating stream:', error);
    }
  };

  const retrieveEdgeStreams = async () => {
    try {
      const response = await axios.get('https://api.thetavideoapi.com/ingestor/filter', {
        headers: {
          'x-tva-sa-id': 'srvacc_2wtggp69w8bnpy6g4mrzb742a',
          'x-tva-sa-secret': 'r6rh6t2s6wppbtscvy1hxzh0fg626p4b'
        }
      });
      setEdgeStreams(response.data.body.ingestors);
      setProgress(50); // Update progress
    } catch (error) {
      console.error('Error retrieving edge streams:', error);
    }
  };

  const selectEdgeStream = async () => {
    if (edgeStreams.length > 0) {
      const edgeStreamId = edgeStreams[0].id; // Select the first edge stream for simplicity
      try {
        const response = await axios.put(`https://api.thetavideoapi.com/ingestor/${edgeStreamId}/select`, {
          tva_stream: streamId
        }, {
          headers: {
            'x-tva-sa-id': 'srvacc_2wtggp69w8bnpy6g4mrzb742a',
            'x-tva-sa-secret': 'r6rh6t2s6wppbtscvy1hxzh0fg626p4b',
            'Content-Type': 'application/json'
          }
        });
        console.log('Edge stream selected:', response.data);
        setProgress(75); // Update progress
      } catch (error) {
        console.error('Error selecting edge stream:', error);
      }
    }
  };

  const retrieveStreamDetails = async () => {
    try {
      const response = await axios.get(`https://api.thetavideoapi.com/stream/${streamId}`, {
        headers: {
          'x-tva-sa-id': 'srvacc_2wtggp69w8bnpy6g4mrzb742a',
          'x-tva-sa-secret': 'r6rh6t2s6wppbtscvy1hxzh0fg626p4b'
        }
      });
      setStreamDetails(response.data.body);
      setProgress(100); // Update progress
    } catch (error) {
      console.error('Error retrieving stream details:', error);
    }
  };

  const validProgress = progress > 0 ? progress : 100; // Ensure valid progress value

  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '20px' }}>
      <h1>Live Stream Component</h1>
      <button 
        onClick={createStream} 
        style={{ backgroundColor: 'green', color: 'white', padding: '10px', margin: '10px' }}
      >
        Create Stream
      </button>
      {streamId && <p>Stream ID: {streamId}</p>}
      <button 
        onClick={retrieveEdgeStreams} 
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px', margin: '10px' }}
      >
        Retrieve Edge Streams
      </button>
      {edgeStreams.length > 0 && (
        <div>
          <h2>Select Edge Stream</h2>
          <button 
            onClick={selectEdgeStream} 
            style={{ backgroundColor: 'orange', color: 'black', padding: '10px', margin: '10px' }}
          >
            Select First Edge Stream
          </button>
        </div>
      )}
      <button 
        onClick={retrieveStreamDetails} 
        style={{ backgroundColor: 'purple', color: 'white', padding: '10px', margin: '10px' }}
      >
        Retrieve Stream Details
      </button>
      {streamDetails && (
        <div>
          <h2>Stream Details</h2>
          <p>Status: {streamDetails.status}</p>
          <p>Player URI: {streamDetails.player_uri}</p>
          <p>Playback URI: {streamDetails.playback_uri}</p>
          <p>Stream Key: {streamDetails.stream_key}</p>
          <p>Server URL: {streamDetails.server_url}</p>
        </div>
      )}
      <div>
        <progress 
          value={progress} 
          max={validProgress} 
          style={{ width: '100%', height: '20px', backgroundColor: 'white', color: 'blue' }} 
        />
      </div>
    </div>
  );
};

export default LiveStreamComponent;
