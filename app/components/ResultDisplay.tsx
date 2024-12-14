import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Ruler, Hammer, Calculator, Columns, BeanIcon as Beam, Droplet, Truck, HardHat, BookOpen, Download, Share2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from 'next/image'

function calculateColumns(length: number, width: number, columnSpacing: number): number {
  if (!length || !width || !columnSpacing) return 0
  const columnsAlongLength = Math.floor(length / columnSpacing) + 1
  const columnsAlongWidth = Math.floor(width / columnSpacing) + 1
  return columnsAlongLength * columnsAlongWidth * 18 // Multiply by 18 floors
}

function calculateBeams(length: number, width: number, columnSpacing: number): number {
  if (!length || !width || !columnSpacing) return 0
  const beamsAlongLength = Math.floor(length / columnSpacing) * (Math.floor(width / columnSpacing) + 1)
  const beamsAlongWidth = Math.floor(width / columnSpacing) * (Math.floor(length / columnSpacing) + 1)
  return (beamsAlongLength + beamsAlongWidth) * 18 // Multiply by 18 floors
}

function suggestReinforcement(loadCapacity: number): { barDiameter: string; spacing: string } {
  if (loadCapacity < 30000) {
    return { barDiameter: "12 mm", spacing: "200 mm" } // Light loads
  } else if (loadCapacity < 60000) {
    return { barDiameter: "16 mm", spacing: "150 mm" } // Medium loads
  } else {
    return { barDiameter: "20 mm", spacing: "100 mm" } // Heavy loads
  }
}

export default function ResultDisplay({ result, darkMode }: { result: any; darkMode: boolean }) {
  const [showDetails, setShowDetails] = useState(false)

  if (!result) {
    return <div>No result data available.</div>
  }

  const numColumns = calculateColumns(result.dimensions?.length || 0, result.dimensions?.width || 0, result.structuralDetails?.beamSpacing || 0)
  const numBeams = calculateBeams(result.dimensions?.length || 0, result.dimensions?.width || 0, result.structuralDetails?.beamSpacing || 0)
  const reinforcementDetails = suggestReinforcement(result.structuralDetails?.loadBearingCapacity || 0)

  const handleDownload = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(result, null, 2)
    )}`
    const link = document.createElement("a")
    link.href = jsonString
    link.download = "building_material_calculation.json"
    link.click()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Building Material Calculation Results',
        text: 'Check out my building material calculation results!',
        url: window.location.href,
      })
    } else {
      alert('Sharing is not supported on this device')
    }
  }

  return (
    <div className="space-y-6">
      <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} bg-opacity-90 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-blue-900 to-transparent' : 'from-blue-50 to-transparent'} opacity-50 z-0`}></div>
        <CardHeader className="flex flex-row items-center justify-between space-x-2 relative z-10">
          <div className="flex items-center">
            <Building2 className={`w-8 h-8 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`} />
            <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'} font-serif ml-2`}>Building Dimensions</CardTitle>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Results</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Results</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Ruler className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Length: {result.dimensions?.length || 0} m</p>
            </div>
            <div className="flex items-center">
              <Ruler className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Width: {result.dimensions?.width || 0} m</p>
            </div>
            <div className="flex items-center">
              <Building2 className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Floors: {result.dimensions?.floors || 0}</p>
            </div>
            <div className="flex items-center">
              <Ruler className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Height: {result.dimensions?.buildingHeight || 0} m</p>
            </div>
          </div>
        </CardContent>
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000&h=600" alt="Building Dimensions" width={1000} height={600} className="w-full h-auto object-cover mt-4" />
      </Card>

      <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} bg-opacity-90 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-green-900 to-transparent' : 'from-green-50 to-transparent'} opacity-50 z-0`}></div>
        <CardHeader className="flex flex-row items-center space-x-2 relative z-10">
          <Hammer className={`w-8 h-8 ${darkMode ? 'text-green-300' : 'text-green-800'}`} />
          <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-800'} font-serif`}>Structural Details</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Columns className={`w-6 h-6 mr-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Number of Columns: {numColumns}</p>
            </div>
            <div className="flex items-center">
              <Beam className={`w-6 h-6 mr-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Number of Beams: {numBeams}</p>
            </div>
            <div className="flex items-center">
              <Ruler className={`w-6 h-6 mr-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Beam Spacing: {result.structuralDetails?.beamSpacing || 0} m</p>
            </div>
            <div className="flex items-center">
              <Building2 className={`w-6 h-6 mr-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Slab Type: {result.structuralDetails?.slabType || "N/A"}</p>
            </div>
            <div className="flex items-center col-span-2">
              <HardHat className={`w-6 h-6 mr-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Load Bearing Capacity: {(result.structuralDetails?.loadBearingCapacity || 0).toFixed(2)} kN</p>
            </div>
            <div className="col-span-2">
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-bold mt-4`}>Reinforcement Details:</p>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bar Diameter: {reinforcementDetails.barDiameter}</p>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bar Spacing: {reinforcementDetails.spacing}</p>
            </div>
          </div>
        </CardContent>
        <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000&h=600" alt="Structural Details" width={1000} height={600} className="w-full h-auto object-cover mt-4" />
      </Card>

      <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} bg-opacity-90 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-purple-900 to-transparent' : 'from-purple-50 to-transparent'} opacity-50 z-0`}></div>
        <CardHeader className="flex flex-row items-center space-x-2 relative z-10">
          <Truck className={`w-8 h-8 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`} />
          <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'} font-serif`}>Material Quantities</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Building2 className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Concrete: {(result.quantities?.totalConcreteVolume || 0).toFixed(2)} m³</p>
            </div>
            <div className="flex items-center">
              <Truck className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cement: {(result.quantities?.cement || 0).toFixed(2)} tons</p>
            </div>
            <div className="flex items-center">
              <Droplet className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Water: {(result.quantities?.water || 0).toFixed(2)} m³</p>
            </div>
            <div className="flex items-center">
              <Truck className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sand: {(result.quantities?.sand || 0).toFixed(2)} tons</p>
            </div>
            <div className="flex items-center">
              <Truck className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aggregate: {(result.quantities?.aggregate || 0).toFixed(2)} tons</p>
            </div>
            <div className="flex items-center">
              <Truck className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Steel: {(result.quantities?.steel || 0).toFixed(2)} kg</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {[
              { src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=300&h=200", alt: "Concrete", label: "Concrete" },
              { src: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=300&h=200", alt: "Cement", label: "Cement" },
              { src: "https://images.unsplash.com/photo-1603321544554-f416a9a11fcb?auto=format&fit=crop&q=80&w=300&h=200", alt: "Water", label: "Water" },
              { src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300&h=200", alt: "Sand", label: "Sand" },
              { src: "https://images.unsplash.com/photo-1566285284058-5e83535de191?auto=format&fit=crop&q=80&w=300&h=200", alt: "Aggregate", label: "Aggregate" },
              { src: "https://images.unsplash.com/photo-1530983822321-fcac2d3c0f06?auto=format&fit=crop&q=80&w=300&h=200", alt: "Steel", label: "Steel" },
            ].map((item, index) => (
              <div key={index} className="relative">
                <Image src={item.src} alt={item.alt} width={300} height={200} className="w-full h-auto object-cover rounded-lg shadow-md" />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                  <p className="text-center font-semibold">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} bg-opacity-90 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-red-900 to-transparent' : 'from-red-50 to-transparent'} opacity-50 z-0`}></div>
        <CardHeader className="flex flex-row items-center space-x-2 relative z-10">
          <Calculator className={`w-8 h-8 ${darkMode ? 'text-red-300' : 'text-red-800'}`} />
          <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-red-300' : 'text-red-800'} font-serif`}>Costs (INR)</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cement:</span>
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>₹{(result.costs?.cement || 0).toFixed(2)}</span>
            </div>
            <Progress value={(result.costs?.cement || 0) / (result.costs?.total || 1) * 100} className="h-2" />

            <div className="flex justify-between items-center">
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sand:</span>
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>₹{(result.costs?.sand || 0).toFixed(2)}</span>
            </div>
            <Progress value={(result.costs?.sand || 0) / (result.costs?.total || 1) * 100} className="h-2" />

            <div className="flex justify-between items-center">
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aggregate:</span>
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>₹{(result.costs?.aggregate || 0).toFixed(2)}</span>
            </div>
            <Progress value={(result.costs?.aggregate || 0) / (result.costs?.total || 1) * 100} className="h-2" />

            <div className="flex justify-between items-center">
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Steel:</span>
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>₹{(result.costs?.steel || 0).toFixed(2)}</span>
            </div>
            <Progress value={(result.costs?.steel || 0) / (result.costs?.total || 1) * 100} className="h-2" />

            <div className="flex justify-between items-center">
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Water:</span>
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>₹{(result.costs?.water || 0).toFixed(2)}</span>
            </div>
            <Progress value={(result.costs?.water || 0) / (result.costs?.total || 1) * 100} className="h-2" />

            <div className="flex justify-between items-center">
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Labor:</span>
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>₹{(result.costs?.labor || 0).toFixed(2)}</span>
            </div>
            <Progress value={(result.costs?.labor || 0) / (result.costs?.total || 1) * 100} className="h-2" />
          </div>
          <p className={`text-2xl font-bold mt-4 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>Total Cost: ₹{(result.costs?.total || 0).toFixed(2)}</p>
        </CardContent>
        <Image src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000&h=600" alt="Construction Costs" width={1000} height={600} className="w-full h-auto object-cover mt-4" />
      </Card>

      <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} bg-opacity-90 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-yellow-900 to-transparent' : 'from-yellow-50 to-transparent'} opacity-50 z-0`}></div>
        <CardHeader className="flex flex-row items-center space-x-2 relative z-10">
          <BookOpen className={`w-8 h-8 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`} />
          <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'} font-serif`}>IS Code References</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-2">
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Concrete Design: {result.isCodeReferences?.concreteDesign}</p>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mix Design: {result.isCodeReferences?.mixDesign}</p>
          </div>
        </CardContent>
      </Card>

      <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} bg-opacity-90 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-teal-900 to-transparent' : 'from-teal-50 to-transparent'} opacity-50 z-0`}></div>
        <CardHeader className="flex flex-row items-center space-x-2 relative z-10">
          <Droplet className={`w-8 h-8 ${darkMode ? 'text-teal-300' : 'text-teal-800'}`} />
          <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-teal-300' : 'text-teal-800'} font-serif`}>Sustainability Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <ul className="list-disc list-inside space-y-2">
            {result.sustainabilitySuggestions.map((suggestion: string, index: number) => (
              <li key={index} className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{suggestion}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button onClick={() => setShowDetails(!showDetails)} className="w-full mt-4">
        {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
      </Button>

      {showDetails && (
        <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} bg-opacity-90 relative overflow-hidden mt-4`}>
          <CardHeader className="flex flex-row items-center space-x-2 relative z-10">
            <Calculator className={`w-8 h-8 ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`} />
            <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-800'} font-serif`}>Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <pre className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

