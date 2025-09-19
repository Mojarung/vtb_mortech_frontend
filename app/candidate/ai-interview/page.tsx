'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mic, MicOff, Video as VideoIcon, VideoOff as VideoOffIcon, Settings, MessageSquare } from 'lucide-react'
import { PipecatClient } from '@pipecat-ai/client-js'
// @ts-ignore - типы не доступны для daily-transport
import { DailyTransport } from '@pipecat-ai/daily-transport'
import { PipecatClientProvider, usePipecatClient, PipecatClientVideo, PipecatClientAudio, PipecatClientMicToggle, PipecatClientCamToggle } from '@pipecat-ai/client-react'

type MicToggleProps = {
  disabled?: boolean;
  isMicEnabled: boolean;
  onClick: () => void;
}

type CamToggleProps = {
  disabled?: boolean;
  isCamEnabled: boolean;
  onClick: () => void;
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

const API_BASE_URL = process.env.NEXT_PUBLIC_AVATAR_BASE_URL || ''
const PIPECAT_BACKEND_URL = `${API_BASE_URL.replace(/\/$/, '')}/avatar/interview`

function AIInterviewPageInternal() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [status, setStatus] = useState('AI бот: Отключено')
  const [currentTime, setCurrentTime] = useState('00:00')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const client = usePipecatClient()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get('interview_id') || ''

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
        const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')
        const seconds = (elapsedSeconds % 60).toString().padStart(2, '0')
        setCurrentTime(`${minutes}:${seconds}`)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [elapsedSeconds, isTimerRunning])

  const handleConnect = useCallback(async () => {
    if (!client || isConnecting || isConnected) return
    try {
      setIsConnecting(true)
      setStatus('AI бот: Подключение...')
      const base = PIPECAT_BACKEND_URL.replace(/\/$/, '')
      const webrtcUrl = interviewId ? `${base}/${encodeURIComponent(interviewId)}` : base
      await (client as any).startBotAndConnect({ 
        endpoint: webrtcUrl })
      setIsConnected(true)
      setStatus('AI бот: ПОДКЛЮЧЕНО')  // Изменил статус
      setIsTimerRunning(true)  // Запускаем таймер
    } catch (e) {
      console.error('Ошибка подключения к Pipecat:', e)
      setIsConnected(false)
      setStatus('AI бот: Ошибка подключения')
    } finally {
      setIsConnecting(false)
    }
  }, [client, isConnecting, isConnected, interviewId])

  const handleDisconnect = useCallback(async () => {
    if (!client || !isConnected) return
    try {
      await client.disconnect()
    } catch (e) {
      console.error('Ошибка отключения:', e)
    } finally {
      setIsConnected(false)
      setStatus('AI бот: Отключено')
    }
  }, [client, isConnected])

  useEffect(() => {
    return () => {
      // Отключаемся при размонтировании
      handleDisconnect()
    }
  }, [handleDisconnect])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
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
        {/* Левая панель - AI HR (видео бота) */}
        <div className="flex-1 relative bg-gray-800">
          <PipecatClientVideo participant="bot" className="absolute inset-0 w-full h-full object-cover" />
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

        {/* Правая панель - Кандидат (локальное видео) */}
        <div className="flex-1 relative bg-gray-700">
          <PipecatClientVideo participant="local" fit="cover" mirror className="absolute inset-0 w-full h-full object-cover" />
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

          <PipecatClientMicToggle>
            {({ disabled, isMicEnabled, onClick }: MicToggleProps) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className={`p-3 rounded-full transition-colors ${isMicEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {isMicEnabled ? <Mic className="text-white" size={20} /> : <MicOff className="text-white" size={20} />}
              </button>
            )}
          </PipecatClientMicToggle>

          <PipecatClientCamToggle>
            {({ disabled, isCamEnabled, onClick }: CamToggleProps) => (
              <button
                onClick={onClick}
                disabled={disabled}
                className={`p-3 rounded-full transition-colors ${isCamEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {isCamEnabled ? <VideoIcon className="text-white" size={20} /> : <VideoOffIcon className="text-white" size={20} />}
              </button>
            )}
          </PipecatClientCamToggle>

          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${isConnecting ? 'bg-purple-400 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
            >
              {isConnecting ? 'Подключение...' : 'Подключиться к AI'}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-6 py-3 rounded-full font-medium transition-colors bg-red-500 hover:bg-red-600 text-white"
            >
              Завершить
            </button>
          )}
        </motion.div>
      </div>

      {/* Аудио бота */}
      <PipecatClientAudio />
    </div>
  )
}

export default function AIInterviewPage() {
  const [isClient, setIsClient] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [status, setStatus] = useState('AI бот: Отключено')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const client = useMemo(() => {
    if (!isClient || typeof window === 'undefined') return null as unknown as PipecatClient
    return new PipecatClient({
      transport: new DailyTransport(),
      enableCam: true,
      enableMic: true,
      callbacks: {
        onBotConnected: () => {
          console.log('🤖 Бот подключился')
          setIsConnected(true)
          setStatus('AI бот: ПОДКЛЮЧЕНО')
          setIsTimerRunning(true)
        },
        onBotDisconnected: () => {
          console.log('🤖 Бот отключился')
          setIsConnected(false)
          setStatus('AI бот: Отключено')
          setIsTimerRunning(false)
        },
        onBotReady: () => console.log('🤖 Бот готов к работе'),
        onError: (error: unknown) => {
          console.error('❌ Ошибка Pipecat:', error)
          setIsConnected(false)
          setStatus('AI бот: Ошибка подключения')
          setIsTimerRunning(false)
        },
        onTrackStarted: (track: MediaStreamTrack, participant?: any) => {
          console.log('🎥 Трек запущен:', track.kind, participant)
        },
      },
    })
  }, [isClient])

  if (!isClient || !client) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Загрузка интервью...</p>
        </div>
      </div>
    )
  }

  return (
    <PipecatClientProvider client={client}>
      <AIInterviewPageInternal />
    </PipecatClientProvider>
  )
}