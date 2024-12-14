'use client'

import { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import BuildingForm from './components/BuildingForm'
import ResultDisplay from './components/ResultDisplay'
import Building3DModel from './components/Building3DModel'
import ProgressBar from './components/ProgressBar'
import BadgeDisplay from './components/BadgeDisplay'
import PDFReport from './components/PDFReport'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'

export default function BuildingMaterialCalculator() {
  const [params, setParams] = useState({
    length: 0,
    width: 0,
    floors: 0,
    buildingType: '',
    concreteGrade: '',
    unit: 'metric',
    materialPrices: {
      cement: 6000,
      sand: 1800,
      aggregate: 1600,
      steel: 55,
      water: 50,
    },
    laborCosts: {
      hourlyWage: 500, // Default hourly wage in INR
      dailyHours: 8,   // Default working hours per day
      productivityRate: 1 // Default productivity rate (1 = standard)
    }
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    setProgress((currentStep / 3) * 100)
  }, [currentStep])

  const handleSubmit = async (formData: any) => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      setResult(data)
      setCurrentStep(4)
      addBadge("First Project")
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addBadge = (badgeName: string) => {
    if (!badges.includes(badgeName)) {
      setBadges([...badges, badgeName])
    }
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white font-serif">Building Material Calculator</h1>
            <div className="flex items-center space-x-2">
              <Sun className="text-yellow-400" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Moon className="text-blue-200" />
            </div>
          </header>
          
          <ProgressBar progress={progress} />
          
          <BadgeDisplay badges={badges} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <Image src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300&h=200" alt="Blueprint" width={300} height={200} className="w-full h-40 object-cover rounded-md mb-2" />
                <h3 className="text-lg font-semibold dark:text-white">Precise Planning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Detailed blueprints for accurate estimations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Image src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=300&h=200" alt="Construction Worker" width={300} height={200} className="w-full h-40 object-cover rounded-md mb-2" />
                <h3 className="text-lg font-semibold dark:text-white">Expert Execution</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Skilled professionals bringing plans to life</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Image src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=300&h=200" alt="Building Materials" width={300} height={200} className="w-full h-40 object-cover rounded-md mb-2" />
                <h3 className="text-lg font-semibold dark:text-white">Quality Materials</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Top-grade resources for lasting structures</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Image src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=300&h=200" alt="Modern Architecture" width={300} height={200} className="w-full h-40 object-cover rounded-md mb-2" />
                <h3 className="text-lg font-semibold dark:text-white">Innovative Design</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Cutting-edge architectural concepts</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-lg shadow-xl p-6 mb-8">
            {currentStep < 4 && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3].map((step) => (
                    <Button
                      key={step}
                      onClick={() => setCurrentStep(step)}
                      variant={currentStep === step ? "default" : "outline"}
                    >
                      Step {step}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {currentStep < 4 && (
              <BuildingForm
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                onSubmit={handleSubmit}
                params={params}
                setParams={setParams}
              />
            )}
            
            {loading && (
              <div className="flex justify-center items-center">
                <ClipLoader color="#3B82F6" size={50} />
              </div>
            )}
            
            {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-100">{error}</div>}
            
            {currentStep === 4 && result && (
              <>
                <ResultDisplay result={result} darkMode={darkMode} />
                <div className="mt-4 space-x-4">
                  <Button onClick={() => setCurrentStep(1)}>
                    Start Over
                  </Button>
                  <PDFReport result={result} />
                </div>
              </>
            )}
          </Card>

          <Building3DModel />
        </div>
        <footer className="mt-12 text-center">
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-4">
            <Image src="https://images.unsplash.com/photo-1590725140246-20acddc1ec6f?auto=format&fit=crop&q=80&w=300&h=100" alt="Construction Site" width={300} height={100} className="w-full h-24 object-cover rounded-lg shadow-lg" />
            <Image src="https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&q=80&w=300&h=100" alt="Building Design" width={300} height={100} className="w-full h-24 object-cover rounded-lg shadow-lg" />
            <Image src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=300&h=100" alt="Architectural Model" width={300} height={100} className="w-full h-24 object-cover rounded-lg shadow-lg" />
          </div>
          <div className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
            <p>&copy; 2023 Building Material Calculator. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">Privacy Policy</a>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">Terms of Service</a>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

