# Entro-py

## Description

This folder contains the dataset collected with **Entro-py**, a DIY urban scraping tool designed and developed by students at SUPSI during the **DIY Urban Scraping Summer Workshop**.

The tool captures photographs of cigarette butts found in public spaces and algorithmically deforms the images based on the distance (in meters) from the detected cigarette butt to the nearest cigarette disposal device (ashtray or dedicated cigarette bin). The resulting images are intended to make visible the relationship between littering practices and the availability of urban waste infrastructure.

## Data Collection Context

The data were collected in **Lugano (Switzerland)** on **16–17 July 2025** during the **Pixel Urbani** workshop, organized within the **Lugano LongLake Festival**.

Data collection took place through a series of guided urban walks involving citizens and workshop participants in the **Foce–Cassarate area**, a lakeside district located at the northeastern edge of Lugano’s city center, characterized by public recreational spaces, pedestrian routes, cultural venues, and access to Lake Lugano.

Participants documented cigarette butts encountered along predefined walking routes while exploring the relationship between urban infrastructure, public behavior, and environmental traces.

## Folder Contents

### `Entro-py_camera`

Folder containing all images captured by the Entro-py tool during the data collection walks.

### `Entro-py_gps-log.csv`

Spreadsheet containing geolocation and timestamp information associated with each recorded observation.

**Main fields include:**

- **TIME** – timestamp of data collection
- **latitude** – geographic latitude
- **longitude** – geographic longitude

### `Entro-py_metadata.json`

Metadata file containing structured information associated with each observation.

The file may include:

- Timestamp
- Geographic coordinates
- Image filename
- Distance to nearest cigarette disposal device
- Device-generated parameters
- Additional sensor or processing information

## License

© 2026. This dataset is part of the **BLUECITY Project** (Innosuisse Flagship 2022–2026) and was produced within the activities of the **Small Data Practices for Urban Dialogue** research initiative.

Unless otherwise stated, all contents of this repository are licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)**.

## How to Cite This Dataset

When using, reproducing, or referring to this dataset, please cite:

> Botta, M., Autuori, A., Terenghi, G., Mioni, A., & Draisci, L. (2026). *Small Data Practices for Urban Dialogue*  
> https://supsi-ide.github.io/smalldatapractices/

## Acknowledgements

This dataset was generated through the **DIY Urban Scraping** workshop and the **Pixel Urbani** activities conducted in Lugano during the **LongLake Festival** (16–17 July 2025), involving SUPSI students, researchers, and local citizens in experimental urban data collection practices.
