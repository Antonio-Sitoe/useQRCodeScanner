import { useState, useEffect, useRef } from 'react'
import {
  BrowserMultiFormatReader,
  NotFoundException,
  Result,
} from '@zxing/library'

const useQRCodeScanner = () => {
  const codeReader = useRef<BrowserMultiFormatReader | null>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState('')

  useEffect(() => {
    const initDevices = async () => {
      try {
        codeReader.current = new BrowserMultiFormatReader()

        const videoInputDevices =
          await codeReader.current?.listVideoInputDevices()

        if (videoInputDevices) {
          setDevices(videoInputDevices)
          if (videoInputDevices.length > 0) {
            setSelectedDeviceId(videoInputDevices[0].deviceId)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    initDevices()

    return () => {
      codeReader.current?.reset()
    }
  }, [])

  const startScanning = () => {
    if (selectedDeviceId) {
      codeReader.current?.decodeFromVideoDevice(
        selectedDeviceId,
        video.current,
        (result: Result, err) => {
          if (result) {
            setResult(result.getText())
          } else if (err && !(err instanceof NotFoundException)) {
            console.error(err)
            setError(err.message)
          }
        },
      )
    }
  }

  const resetScanner = () => {
    codeReader.current?.reset()
    setResult('')
    setError('')
  }

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    result,
    error,
    startScanning,
    resetScanner,
    video,
  }
}

export { useQRCodeScanner }
