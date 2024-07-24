# QR Code Scanner Hook

Este repositório contém um custom hook React para escanear QR codes usando a biblioteca `@zxing/library`. O hook abstrai a lógica de inicialização do leitor de código, gerenciamento de dispositivos de vídeo, e manipulação de resultados e erros, facilitando a reutilização e integração em diferentes componentes React.

## Dependências

- **React:** Certifique-se de que sua aplicação está configurada com React e TypeScript.
- **@zxing/library:** Uma biblioteca JavaScript para ler códigos de barras e QR codes.

### Instalação da Biblioteca

Para instalar a biblioteca `@zxing/library`, use o seguinte comando npm:

```bash
npm install @zxing/library
```

Ou com yarn:

```bash
yarn add @zxing/library
```

> **Nota:** Coloque aqui o [link para a documentação da biblioteca `@zxing/library`](https://www.npmjs.com/package/@zxing/library) para referência adicional.

## Estrutura do Hook

O hook `useQRCodeScanner` fornece a funcionalidade principal para escanear QR codes:

### Importações Necessárias

```javascript
import { useState, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException, Result } from '@zxing/library';
```

### Estado e Funções do Hook

- **`selectedDeviceId`**: O ID do dispositivo de vídeo selecionado.
- **`devices`**: Lista de dispositivos de vídeo disponíveis.
- **`result`**: O texto decodificado do QR code.
- **`error`**: Mensagem de erro, se houver.
- **`startScanning`**: Função para iniciar a leitura do QR code.
- **`resetScanner`**: Função para resetar o estado do scanner.

### Detalhes da Implementação

#### Inicialização e Listagem de Dispositivos

Quando o hook é inicializado, ele lista os dispositivos de vídeo disponíveis e seleciona o primeiro dispositivo, se disponível.

```javascript
useEffect(() => {
  const codeReader = new BrowserMultiFormatReader();

  const initDevices = async () => {
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      setDevices(videoInputDevices);
      if (videoInputDevices.length > 0) {
        setSelectedDeviceId(videoInputDevices[0].deviceId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  initDevices();

  return () => {
    codeReader.reset();
  };
}, []);
```

#### Iniciar a Leitura

A função `startScanning` inicia a decodificação do QR code do vídeo selecionado.

```javascript
const startScanning = () => {
  if (selectedDeviceId) {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      'video',
      (result: Result, err) => {
        if (result) {
          setResult(result.getText());
        } else if (err && !(err instanceof NotFoundException)) {
          console.error(err);
          setError(err.message);
        }
      },
    );
  }
};
```

#### Resetar o Scanner

A função `resetScanner` limpa o resultado e o erro.

```javascript
const resetScanner = () => {
  setResult('');
  setError('');
};
```

## Uso do Hook em um Componente React

Aqui está um exemplo básico de como utilizar o hook `useQRCodeScanner` em um componente React:

```javascript
import React from 'react';
import { useQRCodeScanner } from './useQRCodeScanner';

const QRCodeScannerComponent = () => {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    result,
    error,
    startScanning,
    resetScanner,
  } = useQRCodeScanner();

  return (
    <div>
      <select
        onChange={(e) => setSelectedDeviceId(e.target.value)}
        value={selectedDeviceId || ''}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || device.deviceId}
          </option>
        ))}
      </select>
      <button onClick={startScanning}>Start</button>
      <button onClick={resetScanner}>Reset</button>
      <p>Result: {result}</p>
      <p>Error: {error}</p>
      <video id="video" width="300" height="200" style={{ border: '1px solid black' }}></video>
    </div>
  );
};

export default QRCodeScannerComponent;
```

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

---
