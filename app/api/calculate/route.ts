import { NextResponse } from 'next/server'

interface BuildingParams {
  length: number;
  width: number;
  floors: number;
  buildingType: string;
  concreteGrade: string;
  unit: 'metric' | 'imperial';
  materialPrices: {
    cement: number;
    sand: number;
    aggregate: number;
    steel: number;
    water: number;
  };
  laborCosts: {
    dailyWage: number;
    productivityRate: number;
    projectDuration: number;
  };
}

function calculateBuildingMaterials(params: BuildingParams) {
  const { length, width, floors, buildingType, concreteGrade, unit, materialPrices, laborCosts } = params;

  // Convert imperial to metric if necessary
  const conversionFactor = unit === 'imperial' ? 0.3048 : 1;
  const lengthM = length * conversionFactor;
  const widthM = width * conversionFactor;

  // Default values as per IS 456:2000
  const floorHeight = 3 // meters
  const columnSize = 0.3 // meters (minimum as per IS 456:2000 Clause 26.5.3.1)
  const beamWidth = 0.25 // meters (minimum as per IS 456:2000 Clause 26.5.1.1b)
  const beamDepth = 0.4 // meters (assumed, should be calculated based on span)
  const slabThickness = 0.125 // meters (minimum for two-way slab as per IS 456:2000 Table 24)
  const wallThickness = 0.2 // meters (assumed)
  const foundationDepth = 1 // meters (assumed, should be based on soil conditions)

  // Calculate number of beams and columns
  const beamSpacing = 5 // meters (assumed, should be calculated based on load and span)
  const numBeamsLength = Math.ceil(lengthM / beamSpacing) + 1
  const numBeamsWidth = Math.ceil(widthM / beamSpacing) + 1
  const numBeams = numBeamsLength * numBeamsWidth

  const numColumnsLength = numBeamsLength - 1
  const numColumnsWidth = numBeamsWidth - 1
  const numColumnsPerFloor = (numColumnsLength * numBeamsWidth) + (numColumnsWidth * numBeamsLength)
  const numColumns = numColumnsPerFloor * floors

  // Calculate volumes
  const buildingHeight = floors * floorHeight
  const beamVolume = beamWidth * beamDepth * buildingHeight * numBeams
  const columnVolume = numColumns * columnSize ** 2 * floorHeight
  const slabVolume = lengthM * widthM * slabThickness * floors
  const wallVolume = 2 * (lengthM + widthM) * wallThickness * buildingHeight
  const foundationVolume = lengthM * widthM * foundationDepth

  const totalConcreteVolume = beamVolume + columnVolume + slabVolume + wallVolume + foundationVolume

  // Concrete mix design based on IS 10262:2019
  const concreteProperties: { [key: string]: { strength: number, cement: number, water: number, fineAggregate: number, coarseAggregate: number, waterCementRatio: number } } = {
    "M15": { strength: 15, cement: 300, water: 165, fineAggregate: 720, coarseAggregate: 1265, waterCementRatio: 0.55 },
    "M20": { strength: 20, cement: 330, water: 165, fineAggregate: 700, coarseAggregate: 1265, waterCementRatio: 0.50 },
    "M25": { strength: 25, cement: 360, water: 165, fineAggregate: 680, coarseAggregate: 1265, waterCementRatio: 0.46 },
    "M30": { strength: 30, cement: 390, water: 165, fineAggregate: 660, coarseAggregate: 1265, waterCementRatio: 0.42 },
    "M35": { strength: 35, cement: 420, water: 165, fineAggregate: 640, coarseAggregate: 1265, waterCementRatio: 0.39 },
    "M40": { strength: 40, cement: 450, water: 165, fineAggregate: 620, coarseAggregate: 1265, waterCementRatio: 0.37 },
  }

  const mixDesign = concreteProperties[concreteGrade] || concreteProperties["M25"]

  // Calculate material quantities
  const cement = totalConcreteVolume * mixDesign.cement / 1000 // tons
  const water = totalConcreteVolume * mixDesign.water / 1000 // m³
  const sand = totalConcreteVolume * mixDesign.fineAggregate / 1000 // tons
  const aggregate = totalConcreteVolume * mixDesign.coarseAggregate / 1000 // tons

  // Steel calculation as per IS 456:2000 (simplified)
  const steelRatio = 0.01 // 1% of concrete volume, as a simplified estimate
  const steel = totalConcreteVolume * steelRatio * 7850 // kg (7850 kg/m³ is the density of steel)

  // Load bearing capacity calculation (simplified)
  const loadBearingCapacity = mixDesign.strength * numBeams * beamWidth * beamDepth * 1000 // kN

  // Determine slab type based on building type (simplified)
  let slabType = "One-way slab"
  if (buildingType === "Commercial" || buildingType === "Industrial") {
    slabType = "Two-way slab"
  }

  // Calculate costs
  const cementCost = cement * materialPrices.cement
  const sandCost = sand * materialPrices.sand
  const aggregateCost = aggregate * materialPrices.aggregate
  const steelCost = steel * materialPrices.steel
  const waterCost = water * materialPrices.water

  // Calculate labor requirements
  const totalArea = lengthM * widthM * floors
  const laborDaysRequired = totalArea / laborCosts.productivityRate
  const numberOfLaborers = Math.ceil(laborDaysRequired / laborCosts.projectDuration)
  const totalLaborCost = numberOfLaborers * laborCosts.dailyWage * laborCosts.projectDuration

  // Add labor cost to total cost
  const totalCost = cementCost + sandCost + aggregateCost + steelCost + waterCost + totalLaborCost

  // Sustainability suggestions
  const sustainabilitySuggestions = []
  if (buildingType === "Residential") {
    sustainabilitySuggestions.push("Consider using recycled concrete aggregates for non-structural elements.")
    sustainabilitySuggestions.push("Implement rainwater harvesting systems to reduce water consumption.")
  } else if (buildingType === "Commercial") {
    sustainabilitySuggestions.push("Install solar panels on the roof to offset energy consumption.")
    sustainabilitySuggestions.push("Use low-VOC paints and adhesives to improve indoor air quality.")
  } else if (buildingType === "Industrial") {
    sustainabilitySuggestions.push("Incorporate natural lighting solutions to reduce energy costs.")
    sustainabilitySuggestions.push("Consider using prefabricated elements to reduce on-site waste.")
  }
  sustainabilitySuggestions.push("Use fly ash or ground granulated blast furnace slag as partial cement replacement to reduce CO2 emissions.")

  return {
    dimensions: { length: lengthM, width: widthM, floors, buildingHeight },
    structuralDetails: {
      numColumns,
      numBeams,
      beamSpacing,
      slabType,
      loadBearingCapacity
    },
    mixDesign,
    quantities: {
      totalConcreteVolume,
      cement,
      water,
      sand,
      aggregate,
      steel
    },
    costs: {
      cement: cementCost,
      sand: sandCost,
      aggregate: aggregateCost,
      steel: steelCost,
      water: waterCost,
      labor: totalLaborCost,
      total: totalCost
    },
    labor: {
      numberOfLaborers,
      laborDaysRequired,
      totalLaborCost
    },
    isCodeReferences: {
      concreteDesign: "IS 456:2000",
      mixDesign: "IS 10262:2019"
    },
    sustainabilitySuggestions
  }
}

export async function POST(req: Request) {
  try {
    const params: BuildingParams = await req.json()
    
    // Validate input parameters
    if (!params.length || !params.width || !params.floors || !params.buildingType || !params.concreteGrade) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Ensure numeric values are positive
    if (params.length <= 0 || params.width <= 0 || params.floors <= 0) {
      return NextResponse.json({ error: 'Length, width, and floors must be positive numbers' }, { status: 400 })
    }

    // Validate building type
    const validBuildingTypes = ['Residential', 'Commercial', 'Industrial']
    if (!validBuildingTypes.includes(params.buildingType)) {
      return NextResponse.json({ error: 'Invalid building type' }, { status: 400 })
    }

    // Validate concrete grade
    const validConcreteGrades = ['M15', 'M20', 'M25', 'M30', 'M35', 'M40']
    if (!validConcreteGrades.includes(params.concreteGrade)) {
      return NextResponse.json({ error: 'Invalid concrete grade' }, { status: 400 })
    }

    const result = calculateBuildingMaterials(params)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 })
  }
}

