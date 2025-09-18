'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Settings, MessageSquare } from 'lucide-react'

export default function AIInterviewPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [status, setStatus] = useState('AI бот: Подключение...')
  const [currentTime, setCurrentTime] = useState('00:00')
  const audioRef = useRef<HTMLAudioElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      setCurrentTime(`${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const waitForIceGatheringComplete = async (pc: RTCPeerConnection, timeoutMs = 2000) => {
    if (pc.iceGatheringState === 'complete') return
    return new Promise<void>((resolve) => {
      let timeoutId: NodeJS.Timeout
      const checkState = () => {
        if (pc.iceGatheringState === 'complete') {
          cleanup()
          resolve()
        }
      }
      const onTimeout = () => {
        console.warn(`ICE gathering timed out after ${timeoutMs} ms.`)
        cleanup()
        resolve()
      }
      const cleanup = () => {
        pc.removeEventListener('icegatheringstatechange', checkState)
        clearTimeout(timeoutId)
      }
      pc.addEventListener('icegatheringstatechange', checkState)
      timeoutId = setTimeout(onTimeout, timeoutMs)
      checkState()
    })
  }

  const createWebRTCConnection = async () => {
    const config: RTCConfiguration = {
      iceServers: [],
    }
    const pc = new RTCPeerConnection(config)

    pc.ontrack = (event) => {
      if (audioRef.current) {
        audioRef.current.srcObject = event.streams[0]
      }
    }

    pc.oniceconnectionstatechange = () => {
      switch (pc.iceConnectionState) {
        case 'connected':
          setStatus('AI бот: Подключено')
          setIsConnected(true)
          break
        case 'disconnected':
        case 'failed':
          setStatus('AI бот: Отключено')
          setIsConnected(false)
          break
      }
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: !isVideoOff 
      })
      audioStream.getTracks().forEach(track => pc.addTrack(track, audioStream))

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      await waitForIceGatheringComplete(pc)

      // Отправка offer на сервер
      const response = await fetch('/api/ai-interview/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sdp: pc.localDescription?.sdp,
          type: pc.localDescription?.type
        })
      })

      const answer = await response.json()
      await pc.setRemoteDescription(new RTCSessionDescription(answer))

      peerConnectionRef.current = pc
    } catch (error) {
      console.error('WebRTC connection error:', error)
      setStatus('AI бот: Ошибка подключения')
    }
  }

  const toggleConnection = async () => {
    if (isConnected) {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      setIsConnected(false)
      setStatus('AI бот: Отключено')
    } else {
      await createWebRTCConnection()
    }
  }

  const toggleMicrophone = () => {
    setIsMicrophoneMuted(!isMicrophoneMuted)
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">{status}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">{currentTime}</div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Левая панель - AI HR */}
        <div className="flex-1 relative bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-4xl text-indigo-600 font-bold">AI</span>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">AI HR Интервьюер</h2>
              <p className="text-gray-400">Альберт Храмов • Backend Developer</p>
            </div>
          </div>
          
          {/* Участники */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 bg-black bg-opacity-50 rounded-full px-4 py-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">👥</span>
              </div>
              <span className="text-sm text-white">2 участника</span>
            </div>
          </div>
        </div>

        {/* Правая панель - Кандидат */}
        <div className="flex-1 relative bg-gray-700">
          <div className="absolute inset-0 flex items-center justify-center">
            {isVideoOff ? (
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <VideoOff className="text-gray-400" size={48} />
                </div>
                <p className="text-gray-400">Камера выключена</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <span className="text-4xl text-blue-600 font-bold">Вы</span>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">Кандидат</h2>
                <p className="text-gray-400">В процессе интервью</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Панель управления */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-gray-700"
        >
          <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
            <Settings className="text-white" size={20} />
          </button>
          
          <button
            onClick={toggleMicrophone}
            className={`p-3 rounded-full transition-colors ${
              isMicrophoneMuted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMicrophoneMuted ? <MicOff className="text-white" size={20} /> : <Mic className="text-white" size={20} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoOff 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? <VideoOff className="text-white" size={20} /> : <Video className="text-white" size={20} />}
          </button>

          <button 
            onClick={toggleConnection}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isConnected ? 'Завершить' : 'Подключение...'}
          </button>
        </motion.div>
      </div>

      <audio ref={audioRef} autoPlay hidden />
    </div>
  )
}