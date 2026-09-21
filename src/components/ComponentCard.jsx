.components-simple-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 25px;
}

.simple-component-card {
  background: #ffffff;
  border: 1px solid #e1eaf4;
  border-radius: 10px;
  padding: 20px;

  transition: transform 0.2s, box-shadow 0.2s;
}

.simple-component-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 42, 86, 0.08);
}

.simple-component-card h3 {
  color: #102a56;
  font-size: 16px;
  margin: 0 0 8px;
}

.simple-component-card p {
  color: #71809a;
  font-size: 13px;
  line-height: 1.5;
}

.simple-component-card a {
  display: inline-block;
  margin-top: 10px;
  color: #1465e8;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.simple-component-card a:hover {
  text-decoration: underline;
}

@media (max-width: 1000px) {
  .components-simple-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .components-simple-grid {
    grid-template-columns: 1fr;
  }
}