-- Таблица юридических лиц
CREATE TABLE IF NOT EXISTS legal_entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    inn VARCHAR(12) UNIQUE NOT NULL,
    kpp VARCHAR(9),
    ogrn VARCHAR(15),
    legal_address TEXT,
    actual_address TEXT,
    director_name VARCHAR(300),
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица проектов
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    legal_entity_id INTEGER REFERENCES legal_entities(id),
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица связи пользователей с проектами
CREATE TABLE IF NOT EXISTS user_projects (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    project_id INTEGER REFERENCES projects(id),
    role VARCHAR(50) DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, project_id)
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_user_projects_email ON user_projects(user_email);
CREATE INDEX IF NOT EXISTS idx_projects_legal_entity ON projects(legal_entity_id);
CREATE INDEX IF NOT EXISTS idx_legal_entities_inn ON legal_entities(inn);

-- Комментарии
COMMENT ON TABLE legal_entities IS 'Справочник юридических лиц';
COMMENT ON TABLE projects IS 'Справочник проектов';
COMMENT ON TABLE user_projects IS 'Связь пользователей с проектами';
COMMENT ON COLUMN user_projects.role IS 'Роль: client (клиент) или employee (сотрудник)';