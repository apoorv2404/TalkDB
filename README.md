# TalkDB

Directory structure:
└── apoorv2404-TalkDB/
    ├── README.md
    ├── Backend/
    │   ├── main.py
    │   ├── requirements.txt
    │   ├── __pycache__/
    │   └── app/
    │       ├── api/
    │       │   ├── routes.py
    │       │   └── __pycache__/
    │       ├── core/
    │       │   ├── config.py
    │       │   ├── logging.py
    │       │   └── __pycache__/
    │       ├── db/
    │       │   ├── milvus_client.py
    │       │   ├── session.py
    │       │   └── __pycache__/
    │       ├── models/
    │       │   └── schema.py
    │       └── utils/
    │           ├── db_url_util.py
    │           ├── query_processing.py
    │           └── __pycache__/
    └── Frontend/
        ├── README.md
        ├── components.json
        ├── eslint.config.mjs
        ├── next.config.ts
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.mjs
        ├── tailwind.config.ts
        ├── tsconfig.json
        ├── .gitignore
        ├── public/
        └── src/
            ├── app/
            │   ├── globals.css
            │   ├── layout.tsx
            │   └── page.tsx
            ├── components/
            │   ├── DatabaseExplorer.tsx
            │   ├── ResultsView.tsx
            │   └── ui/
            │       ├── button.tsx
            │       ├── card.tsx
            │       ├── input.tsx
            │       └── tabs.tsx
            └── lib/
                └── utils.ts
