import { Request, Response } from 'express';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const getProjects = (req: Request, res: Response) => {
  db.all('SELECT id, name, created_at, updated_at FROM projects ORDER BY updated_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

export const getProjectById = (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(row);
  });
};

export const createProject = (req: Request, res: Response) => {
  const { name, data } = req.body;
  const id = uuidv4();
  db.run('INSERT INTO projects (id, name, data) VALUES (?, ?, ?)', [id, name, data || ''], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, name, data, created_at: new Date(), updated_at: new Date() });
  });
};

export const updateProject = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, data } = req.body;
  
  let query = 'UPDATE projects SET updated_at = CURRENT_TIMESTAMP';
  const params: any[] = [];
  
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

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project updated successfully' });
  });
};

export const deleteProject = (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  });
};
