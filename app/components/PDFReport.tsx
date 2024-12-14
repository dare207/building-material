import React from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface PDFReportProps {
  result: any
}

const PDFReport: React.FC<PDFReportProps> = ({ result }) => {
  const generatePDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Building Material Calculation Report', 14, 22)

    doc.setFontSize(12)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32)

    doc.setFontSize(14)
    doc.text('Building Dimensions', 14, 45)
    doc.autoTable({
      startY: 50,
      head: [['Dimension', 'Value']],
      body: [
        ['Length', `${result.dimensions.length} m`],
        ['Width', `${result.dimensions.width} m`],
        ['Floors', result.dimensions.floors],
        ['Height', `${result.dimensions.buildingHeight} m`],
      ],
    })

    doc.text('Material Quantities', 14, doc.lastAutoTable.finalY + 10)
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Material', 'Quantity']],
      body: [
        ['Concrete', `${result.quantities.totalConcreteVolume.toFixed(2)} m³`],
        ['Cement', `${result.quantities.cement.toFixed(2)} tons`],
        ['Sand', `${result.quantities.sand.toFixed(2)} tons`],
        ['Aggregate', `${result.quantities.aggregate.toFixed(2)} tons`],
        ['Steel', `${result.quantities.steel.toFixed(2)} kg`],
        ['Water', `${result.quantities.water.toFixed(2)} m³`],
      ],
    })

    doc.text('Costs', 14, doc.lastAutoTable.finalY + 10)
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Item', 'Cost (INR)']],
      body: [
        ['Cement', result.costs.cement.toFixed(2)],
        ['Sand', result.costs.sand.toFixed(2)],
        ['Aggregate', result.costs.aggregate.toFixed(2)],
        ['Steel', result.costs.steel.toFixed(2)],
        ['Water', result.costs.water.toFixed(2)],
        ['Labor', result.costs.labor.toFixed(2)],
        ['Total', result.costs.total.toFixed(2)],
      ],
    })

    doc.text('Labor Details', 14, doc.lastAutoTable.finalY + 10)
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Item', 'Value']],
      body: [
        ['Number of Laborers', result.labor.numberOfLaborers],
        ['Total Labor Days', result.labor.totalLaborDays],
        ['Total Labor Cost', `${result.labor.totalLaborCost.toFixed(2)} INR`],
      ],
    })

    doc.text('Structural Details', 14, doc.lastAutoTable.finalY + 10)
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Item', 'Value']],
      body: [
        ['Number of Columns', result.structuralDetails.numColumns],
        ['Number of Beams', result.structuralDetails.numBeams],
        ['Beam Spacing', `${result.structuralDetails.beamSpacing} m`],
        ['Slab Type', result.structuralDetails.slabType],
        ['Load Bearing Capacity', `${result.structuralDetails.loadBearingCapacity.toFixed(2)} kN`],
      ],
    })

    doc.text('Sustainability Suggestions', 14, doc.lastAutoTable.finalY + 10)
    doc.setFontSize(12)
    result.sustainabilitySuggestions.forEach((suggestion: string, index: number) => {
      doc.text(`${index + 1}. ${suggestion}`, 14, doc.lastAutoTable.finalY + 15 + (index * 7))
    })

    doc.save('building_material_calculation.pdf')
  }

  return (
    <Button onClick={generatePDF}>
      <Download className="mr-2 h-4 w-4" /> Download PDF Report
    </Button>
  )
}

export default PDFReport

