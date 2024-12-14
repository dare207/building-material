import React from 'react'
import { Award } from 'lucide-react'

interface BadgeDisplayProps {
  badges: string[]
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
          <Award className="w-4 h-4 mr-1" />
          {badge}
        </div>
      ))}
    </div>
  )
}

export default BadgeDisplay

