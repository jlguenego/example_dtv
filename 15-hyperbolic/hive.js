(function () {
    'use strict';

    const rotate = (point, angle) => {
        return [
            point[0] * Math.cos(angle) - point[1] * Math.sin(angle),
            point[0] * Math.sin(angle) + point[1] * Math.cos(angle)
        ];
    };

    const rotateArray = (array, angle) => new Array(array.length).fill(0).map((n, i) => rotate(array[i], angle));

    const buildHive = side => {

        if (side === 0) {
            return [[0, 0]];
        }

        const previous = buildHive(side - 1);
        // now add the point around the previous array.
        const length = 6 * side;
        const array = new Array(side).fill(0).map((n, i) => [side - i / 2, i * Math.sqrt(3) / 2]);

        const hexagonArray = new Array(6).fill(0).reduce((acc, n, i) => {
            const a = rotateArray(array, i * Math.PI / 3);
            return acc.concat(a);
        }, []);
        return previous.concat(hexagonArray);
    };

    window.buildHive = buildHive;    
})();