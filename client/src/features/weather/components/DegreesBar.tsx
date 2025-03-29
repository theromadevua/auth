import React from 'react';

type DataPoint = {
    temperature: number;
    time: string;
}

const DegreesBar = ({data}: {data: DataPoint[]}) => {
    const width = data.length * 100;
    const height = 200;
    const padding = 40;

    const temperatures = data.map(point => point.temperature);
    
    const points = data.map((point, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
        const y = height - (padding + (point.temperature * (height - 2 * padding)) / Math.max(...temperatures));
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className='degrees-bar'>
            <svg width={width} height={height}>
                <path
                    d={`M ${points}`}
                    fill="none"
                    stroke='white'
                    strokeWidth="2"
                    style={{
                        transition: 'all 0.3s ease-in-out'
                    }}
                />

                {data.map((point, index) => {
                    const x: number = Number(points.split(' ')[index].split(',')[0]);
                    const y: number = Number(points.split(' ')[index].split(',')[1]);
                    
                    return (
                        <g key={index}>
                            <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                fontSize="12"
                            >
                                {point.temperature}°
                            </text>
                            
                            <text
                                x={x}
                                y={height - 10}
                                textAnchor="middle"
                                fontSize="12"
                            >
                                {point.time}
                            </text>
                    
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#2196f3"
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default DegreesBar;