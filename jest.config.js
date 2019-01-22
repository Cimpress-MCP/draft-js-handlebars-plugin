module.exports = {
    "snapshotSerializers": [
        "enzyme-to-json/serializer"
    ],
    "clearMocks": true,
    "coverageDirectory": "coverage",
    "transform": {
        "^.+\\.js$": "babel-jest",
        ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css"
    }
}