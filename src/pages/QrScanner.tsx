import { useState } from 'react'
import QrInput from '../components/QrInput/QrInput'
import ContentRenderer from '../components/ContentRenderer'

interface QrScannerProps {
  disabled?: boolean
}

export default function QrScanner({ disabled = false }: QrScannerProps) {
  const [data, setData] = useState<string | null>(null)

  return (
    <div>
      <QrInput
        disabled={disabled}
        onChange={setData}
      />
      {data && <ContentRenderer data={data} />}
    </div>
  )
}
