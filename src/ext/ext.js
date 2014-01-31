/**
 * My additions to gl matrix
 */

vec3.ZERO = vec3.fromValues(0, 0, 0);
vec3.POS_X = vec3.fromValues(1, 0, 0);
vec3.NEG_X = vec3.fromValues(-1, 0, 0);
vec3.POS_Y = vec3.fromValues(0, 1, 0);
vec3.NEG_Y = vec3.fromValues(0, -1, 0);
vec3.POS_Z = vec3.fromValues(0, 0, 1);
vec3.NEG_Z = vec3.fromValues(0, 0, -1);
vec3.ONE = vec3.fromValues(1, 1, 1);

/**
 * Returns orientation's axes as an object containing right(x), up(y) and view(z) vectors 
 * @param {quat} q				orientation's quaternion
 * @param {Object} axes			object containig three axes vectors
 * @param {vec3} axes.right		right (x) axis vector
 * @param {vec3} axes.up		up(y) axis vector
 * @param {vec3} axes.view		view(z) axis vector
 * @return {Object}				axes, or creates a new object containing right(x), up(y) and view(z) vectors 
 */
quat.getAxes = (function() {
    var matr = mat3.create();

    return function(q, axes){
		if(!axes) axes = {};
		if(!axes.right) axes.right = vec3.create();
		if(!axes.up) axes.up = vec3.create();
		if(!axes.view) axes.view = vec3.create();
		
		mat3.fromQuat(matr, q);
		
		axes.right[0] = matr[0];
		axes.right[1] = matr[1];
		axes.right[2] = matr[2];
		
		axes.up[0] = matr[3];
		axes.up[1] = matr[4];
		axes.up[2] = matr[5];

		axes.view[0] = matr[6];
		axes.view[1] = matr[7];
		axes.view[2] = matr[8];

		return axes;
	};
});

vec3.fastTransformQuat = function(out, a, q){
	// nVidia SDK implementations with cross products
	// benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
	var w2 = 2.0 * q[3],
		qx = q[0], qy = q[1], qz = q[2],
        ax = a[0], ay = a[1], az = a[2],

		uvx = qy * az - qz * ay,
		uvy = qz * ax - qx * az,
		uvz = qx * ay - qy * ax;

    out[0] = a[0] + (w2 * uvx) + (qy * uvz - qz * uvy)*2.0;
    out[1] = a[1] + (w2 * uvy) + (qz * uvx - qx * uvz)*2.0;
    out[2] = a[2] + (w2 * uvz) + (qx * uvy - qy * uvx)*2.0;
};
// NOTE: overwriting upstream version
vec3.transformQuat = vec3.fastTransformQuat;