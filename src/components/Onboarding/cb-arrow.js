import React from "react";

export default (props) => {
	const { startBox, endBox, color, width } = props
	const clr = color || "red"
	const w = width || 2
	const arrowSize = 10

	if (!startBox || !endBox)
		return <React.Fragment></React.Fragment>;

	const startTop = startBox.bottom>=endBox.top
	const endTop = endBox.bottom + arrowSize*w >=startBox.top
	const start = {
		x: startBox.left + startBox.width / 2, 
		y: startTop ? startBox.top : startBox.bottom
	}
	const end = {
		x: endBox.left + endBox.width / 2, 
		y: endTop ? endBox.top - arrowSize*w : endBox.bottom + arrowSize*w
	}
	const cpt1 = {
		x: start.x, 
		y: start.y + (end.y - start.y) / 2
	}
	const cpt2 = {
		x: end.x, 
		y: end.y - (end.y - start.y) / 2
	}
	const cpt3 = {
		x: (start.x + end.x) / 2,
		y: Math.max(0, (start.y + end.y) / 2 - Math.abs(end.x - start.x))
	}
	const path = startTop && endTop ? 
		`M ${start.x} ${start.y} Q ${cpt3.x} ${cpt3.y} ${end.x} ${end.y}` :
		`M ${start.x} ${start.y} C ${cpt1.x} ${cpt1.y} ${cpt2.x} ${cpt2.y} ${end.x} ${end.y}`
	return (
		<svg style={{position: "absolute"}} height="100%" width="100%">
			<defs>
				<marker id="triangle" viewBox={`0 0 ${arrowSize} ${arrowSize}`}
          refX="0" refY={arrowSize/2} 
          markerUnits="strokeWidth"
          markerWidth={arrowSize} markerHeight={arrowSize}
          orient="auto">
      		<path d={`M 0 0 L ${arrowSize} ${arrowSize/2} L 0 ${arrowSize} z`} style={{fill: clr}} />
    		</marker>
			</defs>
			<path d={path}
				style={{
							stroke: clr,
							strokeWidth: `${w}px`,
							fill: "none",
							markerEnd: "url(#triangle)", 
							transition: "all .5s ease-out"
						}}
			/>
		</svg>
	)
}