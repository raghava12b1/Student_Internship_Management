import "./Statistics.css";

function Statistics() {
  const stats = [
    {
      number: "5000+",
      title: "Students",
    },
    {
      number: "250+",
      title: "Companies",
    },
    {
      number: "1200+",
      title: "Internships",
    },
    {
      number: "95%",
      title: "Placement Success",
    },
  ];

  return (
    <section className="statistics">
      <div className="container">
        <h2 className="stats-heading">Our Achievements</h2>

        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <h1>{item.number}</h1>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;