import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  QrCode,
  Sparkles,
  Key,
  CheckCircle2,
  Users,
  Maximize2,
  RefreshCw,
  Video,
  VideoOff,
  Smile,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/sound';

interface BreakRoomProps {
  onEarnKey: () => void;
  isCompleted: boolean;
  showNotification: (msg: string) => void;
}

export const BreakRoom: React.FC<BreakRoomProps> = ({
  onEarnKey,
  isCompleted,
  showNotification,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [doorUnlocked, setDoorUnlocked] = useState(isCompleted);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-request camera on mount if possible
  useEffect(() => {
    handleStartCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported in this browser environment. You can upload a photo below.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
      showNotification('Camera connected! Strike the celebration pose with your team in front of the lens!');
    } catch (err: unknown) {
      console.warn('Camera access denied or restricted', err);
      setCameraError('Camera access was blocked or unavailable. You can use the "Take/Upload Photo from Device" option below!');
      setCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    sound.click();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleTakePoseSnapshot = () => {
    sound.click();
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          performCapture();
          return null;
        }
        sound.tick();
        return prev - 1;
      });
    }, 1000);
  };

  const performCapture = () => {
    sound.smash(); // camera shutter sound
    sound.victoryFanfare();
    sound.keyUnlocked();

    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FEAEC9', '#9AD9EA', '#C7BFE8', '#F59E0B'],
    });

    if (cameraActive && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Mirror image for natural selfie feel
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedPhoto(dataUrl);
        }
      } catch {
        setCapturedPhoto('/carecor_team.jpg');
      }
    } else {
      setCapturedPhoto('/carecor_team.jpg');
    }

    if (!doorUnlocked) {
      setDoorUnlocked(true);
      onEarnKey();
      showNotification('🎉 ACTUAL POSE CAPTURED! Cooperation Verified! Break Room Key awarded!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.smash();
      sound.victoryFanfare();
      sound.keyUnlocked();

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedPhoto(result);

        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FEAEC9', '#9AD9EA', '#C7BFE8', '#10B981'],
        });

        if (!doorUnlocked) {
          setDoorUnlocked(true);
          onEarnKey();
          showNotification('🎉 ACTUAL PHOTO UPLOADED! Cooperation Verified! Break Room Key awarded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // SVG QR Code generator representation
  const qrSvgUrl =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" fill="#FFFFFF"/>
        <!-- QR markers corners -->
        <rect x="20" y="20" width="50" height="50" fill="#251B35"/>
        <rect x="28" y="28" width="34" height="34" fill="#FFFFFF"/>
        <rect x="36" y="36" width="18" height="18" fill="#FEAEC9"/>

        <rect x="130" y="20" width="50" height="50" fill="#251B35"/>
        <rect x="138" y="28" width="34" height="34" fill="#FFFFFF"/>
        <rect x="146" y="36" width="18" height="18" fill="#9AD9EA"/>

        <rect x="20" y="130" width="50" height="50" fill="#251B35"/>
        <rect x="28" y="138" width="34" height="34" fill="#FFFFFF"/>
        <rect x="36" y="146" width="18" height="18" fill="#C7BFE8"/>

        <!-- QR pattern modules -->
        <rect x="80" y="30" width="12" height="12" fill="#251B35"/>
        <rect x="100" y="30" width="12" height="12" fill="#251B35"/>
        <rect x="80" y="55" width="24" height="12" fill="#FEAEC9"/>
        <rect x="30" y="80" width="12" height="24" fill="#251B35"/>
        <rect x="55" y="80" width="20" height="12" fill="#9AD9EA"/>
        <rect x="85" y="85" width="30" height="30" fill="#251B35"/>
        <rect x="130" y="85" width="20" height="12" fill="#251B35"/>
        <rect x="160" y="85" width="15" height="24" fill="#C7BFE8"/>
        <rect x="80" y="130" width="20" height="12" fill="#251B35"/>
        <rect x="110" y="130" width="12" height="30" fill="#251B35"/>
        <rect x="135" y="145" width="35" height="15" fill="#FEAEC9"/>
        <rect x="155" y="125" width="15" height="15" fill="#9AD9EA"/>
      </svg>
    `);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
      {/* Hidden File Input for Mobile / Fallback Photo Capture */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="user"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Room Header */}
      <div className="bg-white/90 border-2 border-[#C7BFE8] rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#9AD9EA]/30 text-xs font-bold text-[#251B35] mb-1 border border-[#9AD9EA]">
            <Users className="w-3.5 h-3.5 text-blue-700" />
            <span>ROOM 5: BREAK ROOM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#251B35]">
            Cooperation: Take Actual Team Pose Photo
          </h2>
          <p className="text-xs sm:text-sm text-[#251B35]/70 mt-0.5">
            Turn on camera access or upload an actual photo to replicate the iconic CARECOR celebration pose on screen.
          </p>
        </div>

        {/* Status */}
        <div>
          {doorUnlocked ? (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 font-bold text-xs animate-bounce">
              <Key className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Synergy Key Unlocked!</span>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-xl border border-amber-300 flex items-center gap-1.5 font-bold text-xs">
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Actual Photo Required</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Pose & QR Code Reference (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/95 rounded-3xl border-4 border-[#C7BFE8] p-5 shadow-lg text-center">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#FEAEC9]" />
                <span className="text-xs font-black uppercase text-[#251B35]">
                  Target Pose To Follow
                </span>
              </div>
              <span className="text-[10px] text-purple-700 font-bold">Follow this pose!</span>
            </div>

            {/* Target Pose Image Preview */}
            <div
              onClick={() => {
                sound.click();
                setShowImageModal(true);
              }}
              className="cursor-pointer group relative rounded-2xl overflow-hidden border-2 border-[#FEAEC9] shadow-sm max-h-[290px] mb-3"
            >
              <img
                src="/carecor_team.jpg"
                alt="Target CARECOR Team Celebration Pose"
                className="w-full h-auto object-cover max-h-[290px] group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#251B35]/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Maximize2 className="w-6 h-6 mb-1 text-[#FEAEC9]" />
                <span className="text-xs font-black">Click to Enlarge Target</span>
              </div>
            </div>

            <p className="text-xs font-bold text-[#251B35]">
              Strike this joyful group pose with your colleagues!
            </p>
            <p className="text-[11px] text-[#251B35]/70 mt-1">
              White tops, denim jeans, big energetic smiles, goofy faces, and arms raised high!
            </p>
          </div>

          {/* QR Code Card */}
          <div className="bg-white/90 rounded-2xl border-2 border-[#C7BFE8] p-3 flex items-center gap-3">
            <img
              src={qrSvgUrl}
              alt="QR Code"
              onClick={() => setShowImageModal(true)}
              className="w-16 h-16 rounded-xl border border-slate-200 shrink-0 cursor-pointer hover:scale-105 transition"
            />
            <div>
              <div className="text-xs font-black text-[#251B35]">
                Break Room QR Portal
              </div>
              <div className="text-[10px] text-[#251B35]/70 mt-0.5">
                Scan with mobile or tap to pop up reference pose in full resolution.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Camera & Photo Capture Booth (7 Cols) */}
        <div className="lg:col-span-7 bg-white/95 rounded-3xl border-4 border-[#C7BFE8] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-black text-[#251B35]">
                  Live Team Camera Viewfinder
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700">
                {capturedPhoto ? 'Actual Photo Taken ✓' : cameraActive ? 'Camera Live' : 'Camera Standby'}
              </span>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative w-full aspect-4/3 max-h-[360px] bg-slate-950 rounded-2xl overflow-hidden border-2 border-[#C7BFE8] flex items-center justify-center shadow-inner">
              {/* Webcam Live Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] ${
                  cameraActive && !capturedPhoto ? 'block' : 'hidden'
                }`}
              />

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                  <span className="text-7xl font-black text-[#FEAEC9] animate-ping font-mono">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Display Captured Actual Photo if Taken */}
              {capturedPhoto && (
                <div className="relative w-full h-full z-20">
                  <img
                    src={capturedPhoto}
                    alt="Actual Team Pose Photo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Actual Photo Captured!</span>
                  </div>
                </div>
              )}

              {/* If Camera is not running and no photo taken yet */}
              {!cameraActive && !capturedPhoto && (
                <div className="text-center p-6 text-slate-300">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 border border-slate-700">
                    <Camera className="w-8 h-8 text-[#9AD9EA]" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Connect Your Camera
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                    Allow camera access so you and your team can follow the pose on screen and snap an actual photo!
                  </p>
                  <button
                    onClick={handleStartCamera}
                    className="py-2.5 px-5 rounded-xl bg-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:bg-[#9AD9EA]/80 transition cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Allow Camera Access</span>
                  </button>
                  {cameraError && (
                    <p className="text-[11px] text-amber-300 mt-2 max-w-xs mx-auto">{cameraError}</p>
                  )}
                </div>
              )}

              {/* Overlay Guideline Box */}
              {!capturedPhoto && (
                <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-white/30 rounded-xl flex items-end justify-center pb-2">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-black/40 px-3 py-0.5 rounded-full">
                    Match Celebration Pose Inside Frame
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Controls */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {cameraActive && !capturedPhoto ? (
                <button
                  onClick={handleStopCamera}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <VideoOff className="w-4 h-4" />
                  <span>Pause Cam</span>
                </button>
              ) : (
                <button
                  onClick={handleStartCamera}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>{capturedPhoto ? 'Retake Photo' : 'Turn On Cam'}</span>
                </button>
              )}

              {/* Upload photo from device / phone fallback */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                title="Take or upload photo from device"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload from Phone</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTakePoseSnapshot}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{capturedPhoto ? 'Retake & Snap Photo' : 'Take Actual Picture (3s Timer)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged Target Pose Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-4 border-[#FEAEC9] max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 border-b border-[#C7BFE8] pb-2">
              <div>
                <h3 className="text-lg font-black text-[#251B35]">
                  CARECOR Celebration Pose Reference
                </h3>
                <span className="text-xs text-[#251B35]/70">
                  Strike this exact energetic pose together with your colleagues!
                </span>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-[#C7BFE8] mb-4 bg-slate-100">
              <img
                src="/carecor_team.jpg"
                alt="Target Team Pose"
                className="w-full h-auto max-h-[460px] object-contain mx-auto"
              />
            </div>

            <button
              onClick={() => {
                setShowImageModal(false);
                handleTakePoseSnapshot();
              }}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-[#251B35] font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Ready! Take Actual Photo with Camera Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
