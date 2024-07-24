import { useState, useEffect } from 'react'
import {
  BrowserMultiFormatReader,
  NotFoundException,
  Result,
} from '@zxing/library'

const useQRCodeScanner = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState('')

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()

    const initDevices = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices()
        setDevices(videoInputDevices)
        if (videoInputDevices.length > 0) {
          setSelectedDeviceId(videoInputDevices[0].deviceId)
        }
      } catch (err) {
        console.error(err)
      }
    }

    initDevices()

    return () => {
      codeReader.reset()
    }
  }, [])

  const startScanning = () => {
    if (selectedDeviceId) {
      const codeReader = new BrowserMultiFormatReader()
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        'video',
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
  }
}

export { useQRCodeScanner }
