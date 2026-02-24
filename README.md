# Projecte Final
## Grup 18


graph TD
    subgraph CLIENTS [Capa de Client: Usuaris]
        Browser[Navegador Web\n(Escriptori/Mòbil)]
        MobileApp[App Mòbil Nativa\n(iOS/Android)]
    end

    subgraph EDGE [Capa d'Accés i Distribució Global]
        CF[AWS CloudFront\n(CDN - Xarxa de Distribució de Contingut)]
        ALB[AWS Application Load Balancer\n(Gestió de tràfic HTTP/WS i SSL)]
    end

    subgraph FRONTEND_HOSTING [Allotjament Frontend Estàtic]
        S3[AWS S3 Bucket\n(Fitxers Astro: HTML, CSS, JS Estàtic)]
    end

    subgraph BACKEND_VPC [AWS VPC - Núvol Privat Virtual (Seguretat)]
        subgraph COMPUTE [Capa de Computació / Temps Real]
            ECS[AWS ECS Fargate Cluster\n(Contenidors Docker)]
            subgraph NODE_APP [Servidor Node.js]
                SocketIO[Socket.io Server\n(Comunicació Bidireccional)]
                API[REST/GraphQL API\n(Lògica de negoci)]
            end
        end

        subgraph DATA [Capa de Dades]
            RDS[(AWS RDS PostgreSQL\nBase de dades principal:\nUsuaris, Xats, Servidors)]
            Redis[(AWS ElastiCache Redis\nOpcional: Gestió de sessions ràpides i 'pub/sub' per escalar Socket.io)]
        end
    end

    %% Flux del Frontend Estàtic (Astro)
    Browser -- "1. Sol·licitud Web (HTTPS)" --> CF
    CF -- "2. Serveix contingut estàtic (Astro Build)" --> S3
    S3 -.-> Browser

    %% Flux del Backend (Socket.io i API)
    Browser -- "3. Connexió WebSocket (wss://) / API Calls" --> ALB
    MobileApp -- "Connexió WebSocket / API Calls" --> ALB
    
    ALB -- "4. Balanç de càrrega" --> ECS
    ECS --> SocketIO
    ECS --> API

    %% Flux de Dades Intern
    SocketIO -- "5. Lectura/Escriptura dades" --> RDS
    API -- "Lectura/Escriptura dades" --> RDS
    
    SocketIO -.-> Redis
    
    %% Estils del diagrama (mermaid)
    classDef aws fill:#ff9900,stroke:#232f3e,color:white;
    classDef db fill:#336699,stroke:#232f3e,color:white,shape:cylinder;
    classDef client fill:#e6e6e6,stroke:#333,color:black;
    classDef vpc fill:#f2f7ff,stroke:#336699,stroke-dasharray: 5 5;

    class CF,ALB,S3,ECS,SocketIO,API aws;
    class RDS,Redis db;
    class Browser,MobileApp client;
    class BACKEND_VPC vpc;