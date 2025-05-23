import React from 'react'

const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-green-600"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export default Spinner
