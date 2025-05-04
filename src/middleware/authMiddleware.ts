import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "secreto";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.warn("Acesso negado: Nenhum cabeçalho de autorização fornecido.");
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  console.log("Token recebido no backend:", token);

  if (!token) {
    console.warn("Acesso negado: Token vazio.");
    res.status(401).json({ message: "Acesso negado. Token inválido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token decodificado com sucesso:", decoded);
    (req as any).user = decoded; // Inclui o CPF no req.user
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(401).json({ message: "Token inválido" });
  }
};