//table tblShape have id: int + name: nvarchar + image: nvarchar
//table tblDiamond + id: int + proportions: nvarchar + diamondOrigin: nvarchar + caratWeight: float + measurements: nvarchar + polish: nvarchar + flourescence: nvarchar + color: int + cut: int + shapeId: int + clarity: nvarchar + symmetry: nvarchar
class tblDiamond {
    constructor(id, proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) {
        this.id = id;
        this.proportions = proportions;
        this.diamondOrigin = diamondOrigin;
        this.caratWeight = caratWeight;
        this.measurements = measurements;
        this.polish = polish;
        this.flourescence = flourescence;
        this.color = color;
        this.cut = cut;
        this.shapeId = shapeId;
        this.clarity = clarity;
        this.symmetry = symmetry;
    }
}

module.exports = tblDiamond;