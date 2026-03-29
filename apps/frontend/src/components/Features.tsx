export default function Features() {
  const features = [
    {
      title: "Smart Booking",
      desc: "Patients can book appointments easily via WhatsApp or web.",
    },
    {
      title: "Doctor Dashboard",
      desc: "Manage daily schedule and patient flow efficiently.",
    },
    {
      title: "Patient Records",
      desc: "All patient data securely stored and accessible.",
    },
    {
      title: "Analytics",
      desc: "Track clinic performance and growth insights.",
    },
  ];

  return (
    <div className="py-24 px-6 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-16">
        Powerful Features
      </h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:scale-105 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
