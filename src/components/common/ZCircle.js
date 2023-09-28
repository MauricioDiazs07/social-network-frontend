//Library Imports
import React from 'react';
import { useSelector } from 'react-redux';
import Svg, { Path } from 'react-native-svg';

//Local Imports
import { getColor } from '../../utils/_support_functions';

const cos = Math.cos;
const sin = Math.sin;
const PI = Math.PI;

const f_matrix_times = (([[a,b], [c,d]], [x,y]) => [ a * x + b * y, c * x + d * y]);
const f_rotate_matrix = (x => [[cos(x),-sin(x)], [sin(x), cos(x)]]);
const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

export default function ZCircle({cx,cy,rx,ry,t1,delta,phi,limit}) {
  const normalizedLimit = delta / limit * 6.283;
  const colors = useSelector(state => state.theme.theme);
  const delta_ = normalizedLimit % (2*Math.PI);
  const rotMatrix = f_rotate_matrix (phi);
  const [sX, sY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1), ry * sin(t1)] ), [cx,cy] ) );
  const [eX, eY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1+delta_), ry * sin(t1+delta_)] ), [cx,cy] ) );
  const fA = ((delta_ > PI) ? 1 : 0);
  const fS = ((delta_ > 0) ? 1 : 0);
  return (
    <Svg width={50} height={50}>
      <Path
        d="M 27.20834407839356 5.122293481605475 A 20 20 15699.043586584556 1 1 26.714259760579683 5.073602596724683"
        stroke={colors.grayScale7}
        fill="none"
        strokeWidth={5}
      />
      {delta >= limit ? <Path
        d="M 27.20834407839356 5.122293481605475 A 20 20 15699.043586584556 1 1 26.714259760579683 5.073602596724683"
        stroke={colors.redColor}
        fill="none"
        strokeWidth={5}
      />
      : <Path
        d={`M ${sX} ${sY} A ${rx} ${ry} ${phi / (2*PI) *360} ${fA} ${fS} ${eX} ${eY}`}
        stroke={getColor(colors, delta, limit)}
        fill="none"
        strokeWidth={5}
        fillOpacity={0.5}
      />}
    </Svg>
  );
}
