
import React from 'react';
import { FlavorProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FlavorRadarProps {
  data: FlavorProfile;
  lang: Language;
  size?: number;
  className?: string;
  showLabels?: boolean;
}

const FlavorRadar: React.FC<FlavorRadarProps> = ({ 
  data, 
  lang, 
  size = 200, 
  className = "",
  showLabels = true 
}) => {
  const t = TRANSLATIONS[lang];
  const center = size / 2;
  const radius = (size / 2) * 0.65; // 留出空间给标签
  const maxVal = 5;

  // 维度定义：酸、甜、醇、苦、余韵
  const axes = [
    { key: 'acidity', label: t.radar_acidity },
    { key: 'sweetness', label: t.radar_sweetness },
    { key: 'body', label: t.radar_body },
    { key: 'bitterness', label: t.radar_bitterness },
    { key: 'aftertaste', label: t.radar_aftertaste }
  ];

  const angleSlice = (Math.PI * 2) / 5;

  // 计算坐标函数
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2; // -PI/2 让第一个点在正上方
    const r = (value / maxVal) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // 生成数据多边形路径
  const points = axes.map((axis, i) => {
    const val = (data as any)[axis.key] || 0;
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 背景网格 (同心圆) */}
        {[1, 2, 3, 4, 5].map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / maxVal) * radius}
            fill="none"
            stroke="#C69C6D"
            strokeOpacity="0.2"
            strokeWidth="1"
            className={level === 5 ? "stroke-mocha/10" : ""}
          />
        ))}

        {/* 轴线 */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(maxVal, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#C69C6D"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据多边形 */}
        <polygon
          points={points}
          fill="#C69C6D"
          fillOpacity="0.4"
          stroke="#5D4037"
          strokeWidth="1.5"
          className="transition-all duration-300 ease-out"
        />

        {/* 数据点装饰 */}
        {axes.map((axis, i) => {
          const val = (data as any)[axis.key] || 0;
          const { x, y } = getCoordinates(val, i);
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={3}
              fill="#5D4037"
              className="transition-all duration-300 ease-out"
            />
          );
        })}

        {/* 标签 */}
        {showLabels && axes.map((axis, i) => {
          // 稍微向外推一点标签位置
          const angle = i * angleSlice - Math.PI / 2;
          const labelRadius = radius + 20; 
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-mocha/60 text-[10px] font-bold font-sans uppercase tracking-wider"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default FlavorRadar;
