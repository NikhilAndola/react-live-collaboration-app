import React, { useEffect, useRef, useState } from 'react';
import Client from '../components/atoms/Client';
import Editor from '../components/atoms/Editor';
import { initSocket } from '../socket';
import { ACTIONS } from '../actions';
import { useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { message } from 'antd';

function EditorPage() {
  const [clients, setClients] = useState([]);
  const codeRef = useRef(null);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId }: any = useParams();

  const socketRef: any = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current?.on('connect_error', (err: any) => handleErrors(err));
      socketRef.current?.on('connect_failed', (err: any) => handleErrors(err));

      const handleErrors = (err: any) => {
        console.log('Error', err);
        message.error('Socket connection failed, Try again later');
        navigate('/');
      };

      socketRef.current?.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      // Listen for new clients joining the chatroom
      socketRef.current?.on(ACTIONS.JOINED, ({ clients, username, socketId }: any) => {
        // this insure that new user connected message do not display to that user itself
        if (username !== Location.state?.username) {
          message.success(`${username} joined the room.`);
        }
        setClients(clients);
        // also send the code to sync
        socketRef.current?.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      // listening for disconnected
      socketRef.current?.on(ACTIONS.DISCONNECTED, ({ socketId, username }: any) => {
        message.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client: any) => client.socketId !== socketId);
        });
      });
    };
    init();

    // cleanup
    return () => {
      socketRef.current && socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!Location.state) {
    return <Navigate to='/' />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      message.success(`roomIs is copied`);
    } catch (error) {
      console.log(error);
      message.error('unable to copy the room Id');
    }
  };

  const leaveRoom = async () => {
    navigate('/');
  };

  return (
    <div className='container-fluid vh-100'>
      <div className='row h-100'>
        {/* client panel */}
        <div className='col-md-2 bg-dark text-light d-flex flex-column h-100' style={{ boxShadow: '2px 0px 4px rgba(0, 0, 0, 0.1)' }}>
          <img src='/images/codecast.png' alt='Logo' className='img-fluid mx-auto' style={{ maxWidth: '150px', marginTop: '-43px' }} />
          <hr style={{ marginTop: '-3rem' }} />

          {/* Client list container */}
          <div className='d-flex flex-column flex-grow-1 overflow-auto'>
            <span className='mb-2'>Members</span>
            {clients.map((client: any) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr />
          {/* Buttons */}
          <div className='mt-auto '>
            <button className='btn btn-success' onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button className='btn btn-danger mt-2 mb-2 px-3 btn-block' onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>

        {/* Editor panel */}
        <div className='col-md-10 text-light d-flex flex-column h-100 '>
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code: any) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
