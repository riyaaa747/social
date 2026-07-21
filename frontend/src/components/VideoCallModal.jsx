import React, { useEffect, useRef } from "react";

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302"
            ]
        }
    ]
};



const VideoCallModal = ({
    socket,
    selectedUser,
    open,
    setOpen
}) => {

    const localVideo = useRef(null);
const remoteVideo = useRef(null);


    const pc = useRef(
        new RTCPeerConnection(servers)
    );

    pc.current.onicecandidate =
    (event) => {

        if(event.candidate){

            console.log(
                "SENDING ICE"
            );

            socket.emit(
                "ice-candidate",
                {
                    to:selectedUser._id,
                    candidate:event.candidate
                }
            );
        }
    };


    // ==========================
    // START CALL
    // ==========================

    const startCall = async () => {

        console.log(
            "CALLING",
            selectedUser?._id
        );

        await startCamera();

        const offer =
            await pc.current
                .createOffer();

        await pc.current
            .setLocalDescription(
                offer
            );

        console.log(
            "OFFER CREATED"
        );

        console.log(
            pc.current
                .signalingState
        );

        socket.emit(
            "call-user",
            {
                to: selectedUser._id,
                offer
            }
        );
    };

    ////////////start 

    ///call
const startCamera = async () => {
    try {

        console.log("Starting camera");

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        
        console.log("Camera started");

        localVideo.current.srcObject = stream;

        stream.getTracks().forEach(track => {
            pc.current.addTrack(track, stream);
        });

        pc.current.ontrack = (event) => {
            console.log("REMOTE TRACK");
            remoteVideo.current.srcObject = event.streams[0];
        };

    } catch (err) {
        console.error("Camera error:", err);
    }
};


////////////////////ICEE
////////////////////////////

const pendingCandidates = useRef([]);
const handleIce = async ({ candidate }) => {

    console.log("RECEIVED ICE");

    if (!pc.current.remoteDescription) {

        console.log("QUEUE ICE");

        pendingCandidates.current.push(candidate);

        return;
    }

    try {

        await pc.current.addIceCandidate(
            new RTCIceCandidate(candidate)
        );

        console.log("ICE ADDED");

    } catch(err) {

        console.log(err);

    }
};


    // ==========================
    // RECEIVE OFFER
    // ==========================

    const handleIncomingCall = async ({ from, offer }) => {

    console.log("INCOMING CALL");

    console.log("1");

    await startCamera();

    console.log("2");

    console.log(pc.current.signalingState);

    await pc.current.setRemoteDescription(
        new RTCSessionDescription(offer)
    );

    console.log("3 REMOTE SET");

    const answer = await pc.current.createAnswer();

    console.log("4 ANSWER CREATED");

    await pc.current.setLocalDescription(answer);

    console.log("5 LOCAL SET");

    socket.emit("answer-call", {
        to: from,
        answer
    });

    console.log("6 ANSWER SENT");
};
    // ==========================
    // RECEIVE ANSWER
    // ==========================

    const handleAnswer =
        async ({ answer }) => {

            console.log(
                "CALL ANSWERED"
            );

            console.log(
                pc.current
                    .signalingState
            );

            await pc.current
                .setRemoteDescription(
                    new RTCSessionDescription(
                        answer
                    )
                );

                while (pendingCandidates.current.length) {

    const candidate =
        pendingCandidates.current.shift();

    await pc.current.addIceCandidate(
        new RTCIceCandidate(candidate)
    );

}

            console.log(
                "ANSWER SET"
            );

            console.log(
                pc.current
                    .signalingState
            );
        };

    // ==========================
    // SOCKET EVENTS
    // ==========================

    useEffect(() => {


        console.log("VideoCallModal mounted");
    console.log("Socket:", socket);

    if (!socket) return;

    console.log("Registering socket listeners");


        if (!socket) return;

        socket.on(
            "incoming-call",
            handleIncomingCall
        );

        socket.on(
            "call-answered",
            handleAnswer
        );

        socket.on(
    "ice-candidate",
    handleIce
);


        return () => {

            socket.off(
                "incoming-call",
                handleIncomingCall
            );

            socket.off(
                "call-answered",
                handleAnswer
            );

            socket.off(
    "ice-candidate",
    handleIce
);

        };

    }, [socket]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50">

            <div className="h-full flex flex-col items-center justify-center gap-6">

                <h1 className="text-white text-3xl">
                    {selectedUser?.username}
                </h1>

                <div className="flex gap-5">

    <video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        className="w-80 border"
    />

    <video
        ref={remoteVideo}
        autoPlay
        playsInline
        className="w-80 border"
    />

</div>

                <button
    onClick={()=>{
        console.log(
            "CALL BUTTON CLICKED"
        );
        startCall();
    }}
    className="bg-green-600 hover:bg-green-300 text-white px-6 py-3 rounded"
>
    Call
</button>

                <button
                    onClick={() => setOpen(false)}
                    className="bg-red-600 text-white px-6 py-3 rounded"
                >
                    Close
                </button>

            </div>

        </div>
    );
};

// export default VideoCallModal;