CREATE TABLE pixel_timeseries (
    id SERIAL PRIMARY KEY,

    mine_id INTEGER NOT NULL,
    date DATE NOT NULL,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    geometry GEOMETRY(Point, 4326),

    b4 DOUBLE PRECISION,
    b8 DOUBLE PRECISION,
    b11 DOUBLE PRECISION,
    ndvi DOUBLE PRECISION,
    nbr DOUBLE PRECISION,

    anomaly_label INTEGER,
    anomaly_score DOUBLE PRECISION,
    excavated_flag INTEGER
);

CREATE INDEX idx_pixel_mine_date
ON pixel_timeseries (mine_id, date);

CREATE INDEX idx_pixel_geometry
ON pixel_timeseries
USING GIST (geometry);
