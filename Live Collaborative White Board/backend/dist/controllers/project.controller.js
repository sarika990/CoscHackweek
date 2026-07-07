"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const db_1 = require("../db");
const uuid_1 = require("uuid");
const getProjects = (req, res) => {
    db_1.db.all('SELECT id, name, created_at, updated_at FROM projects ORDER BY updated_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};
exports.getProjects = getProjects;
const getProjectById = (req, res) => {
    const { id } = req.params;
    db_1.db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(row);
    });
};
exports.getProjectById = getProjectById;
const createProject = (req, res) => {
    const { name, data } = req.body;
    const id = (0, uuid_1.v4)();
    db_1.db.run('INSERT INTO projects (id, name, data) VALUES (?, ?, ?)', [id, name, data || ''], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id, name, data, created_at: new Date(), updated_at: new Date() });
    });
};
exports.createProject = createProject;
const updateProject = (req, res) => {
    const { id } = req.params;
    const { name, data } = req.body;
    let query = 'UPDATE projects SET updated_at = CURRENT_TIMESTAMP';
    const params = [];
    if (name !== undefined) {
        query += ', name = ?';
        params.push(name);
    }
    if (data !== undefined) {
        query += ', data = ?';
        params.push(data);
    }
    query += ' WHERE id = ?';
    params.push(id);
    db_1.db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project updated successfully' });
    });
};
exports.updateProject = updateProject;
const deleteProject = (req, res) => {
    const { id } = req.params;
    db_1.db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    });
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=project.controller.js.map