import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from 'lucide-react'

interface BuildingFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: (formData: any) => void;
  params: any;
  setParams: (params: any) => void;
}

export default function BuildingForm({ currentStep, setCurrentStep, onSubmit, params, setParams }: BuildingFormProps) {
  const handleChange = (field: string, value: any) => {
    setParams((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleUnitChange = (value: string) => {
    const newUnit = value as 'metric' | 'imperial'
    const conversionFactor = newUnit === 'metric' ? 0.3048 : 3.28084
    setParams((prev: any) => ({
      ...prev,
      unit: newUnit,
      length: Number((prev.length * conversionFactor).toFixed(2)),
      width: Number((prev.width * conversionFactor).toFixed(2))
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(params)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentStep === 1 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="length" className="text-gray-700 dark:text-gray-200 font-semibold flex items-center">
                Length ({params.unit === 'metric' ? 'm' : 'ft'}) <span className="text-red-500 ml-1">*</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the length of the building</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="length"
                type="number"
                value={params.length}
                onChange={(e) => handleChange('length', Number(e.target.value))}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="width" className="text-gray-700 dark:text-gray-200 font-semibold flex items-center">
                Width ({params.unit === 'metric' ? 'm' : 'ft'}) <span className="text-red-500 ml-1">*</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the width of the building</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="width"
                type="number"
                value={params.width}
                onChange={(e) => handleChange('width', Number(e.target.value))}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="unit" className="text-gray-700 dark:text-gray-200 font-semibold flex items-center">
              Unit System
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose between metric (meters) and imperial (feet) units</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select onValueChange={handleUnitChange} defaultValue={params.unit}>
              <SelectTrigger className="w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select unit system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (m)</SelectItem>
                <SelectItem value="imperial">Imperial (ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div>
            <Label htmlFor="floors" className="text-gray-700 dark:text-gray-200 font-semibold flex items-center">
              Number of Floors <span className="text-red-500 ml-1">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the total number of floors in the building</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="floors"
              type="number"
              value={params.floors}
              onChange={(e) => handleChange('floors', Number(e.target.value))}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="buildingType" className="text-gray-700 dark:text-gray-200 font-semibold flex items-center">
              Building Type <span className="text-red-500 ml-1">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the type of building you're constructing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select onValueChange={(value) => handleChange('buildingType', value)}>
              <SelectTrigger className="w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="concreteGrade" className="text-gray-700 dark:text-gray-200 font-semibold flex items-center">
              Concrete Grade <span className="text-red-500 ml-1">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the grade of concrete to be used</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select onValueChange={(value) => handleChange('concreteGrade', value)}>
              <SelectTrigger className="w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select concrete grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M15">M15</SelectItem>
                <SelectItem value="M20">M20</SelectItem>
                <SelectItem value="M25">M25</SelectItem>
                <SelectItem value="M30">M30</SelectItem>
                <SelectItem value="M35">M35</SelectItem>
                <SelectItem value="M40">M40</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Material Prices (INR)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cementPrice" className="text-gray-700 dark:text-gray-200">Cement (per ton)</Label>
                <Input
                  id="cementPrice"
                  type="number"
                  value={params.materialPrices.cement}
                  onChange={(e) => handleChange('materialPrices', { ...params.materialPrices, cement: Number(e.target.value) })}
                  className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="sandPrice" className="text-gray-700 dark:text-gray-200">Sand (per ton)</Label>
                <Input
                  id="sandPrice"
                  type="number"
                  value={params.materialPrices.sand}
                  onChange={(e) => handleChange('materialPrices', { ...params.materialPrices, sand: Number(e.target.value) })}
                  className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="aggregatePrice" className="text-gray-700 dark:text-gray-200">Aggregate (per ton)</Label>
                <Input
                  id="aggregatePrice"
                  type="number"
                  value={params.materialPrices.aggregate}
                  onChange={(e) => handleChange('materialPrices', { ...params.materialPrices, aggregate: Number(e.target.value) })}
                  className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="steelPrice" className="text-gray-700 dark:text-gray-200">Steel (per kg)</Label>
                <Input
                  id="steelPrice"
                  type="number"
                  value={params.materialPrices.steel}
                  onChange={(e) => handleChange('materialPrices', { ...params.materialPrices, steel: Number(e.target.value) })}
                  className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Labor Costs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dailyWage" className="text-gray-700 dark:text-gray-200">Daily Wage (INR)</Label>
                <Input
                  id="dailyWage"
                  type="number"
                  value={params.laborCosts.dailyWage}
                  onChange={(e) => handleChange('laborCosts', { ...params.laborCosts, dailyWage: Number(e.target.value) })}
                  className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="productivityRate" className="text-gray-700 dark:text-gray-200">Productivity Rate (m²/day)</Label>
                <Input
                  id="productivityRate"
                  type="number"
                  value={params.laborCosts.productivityRate}
                  onChange={(e) => handleChange('laborCosts', { ...params.laborCosts, productivityRate: Number(e.target.value) })}
                  className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="projectDuration" className="text-gray-700 dark:text-gray-200">Project Duration (days)</Label>
                <Input
                  id="projectDuration"
                  type="number"
                  value={params.laborCosts.projectDuration}
                  onChange={(e) => handleChange('laborCosts', { ...params.laborCosts, projectDuration: Number(e.target.value) })}
                  className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between">
        {currentStep > 1 && (
          <Button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
            Previous
          </Button>
        )}
        {currentStep < 3 && (
          <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </Button>
        )}
        {currentStep === 3 && (
          <Button type="submit">
            Calculate
          </Button>
        )}
      </div>
    </form>
  )
}

