document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar'); // Element kalender
    const modalEl = document.getElementById('detail-modal'); // Modal element
    const modalContentEl = document.getElementById('modal-content'); // Modal content
    const closeModalEl = document.getElementById('close-modal'); // Tombol close modal

    console.log("Script.js loaded successfully"); // Debug: Log untuk memastikan file dimuat

    // Fungsi untuk fetch data dari API
    async function fetchForecastData() {
        try {
            const response = await fetch('/api/forecast');
            if (!response.ok) {
                console.error("Failed to fetch data from API. Status:", response.status);
                return [];
            }
    
            const data = await response.json();
            console.log("Data fetched from API:", data); // Debug log data mentah dari API
    
            // Transformasi data untuk FullCalendar
            return data.map(item => ({
                title: item['extendedProps'].Customer || "No Data", // Nama customer sebagai title
                start: item['start'], // Tanggal event
                extendedProps: {
                    Customer: item['extendedProps'].Customer || "No Data",
                    Koli: item['extendedProps'].Koli || "0.00",
                    Berat: item['extendedProps'].Berat || "0.00",
                    Revenue: item['extendedProps'].Revenue || "0.00"
                }
            }));
        } catch (error) {
            console.error("Error fetching data from API:", error);
            return [];
        }
    }
    // Fungsi untuk memformat angka ke format Rupiah
function formatRupiah(amount) {
    const formatted = parseFloat(amount).toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2
    });
    return formatted;
}

    // Fungsi untuk membuat tabel detail dalam modal
    function createDetailTable(event) {
        const { Customer, Koli, Berat, Revenue } = event.extendedProps;
        return `
            <h2>Detail Tanggal: ${event.startStr}</h2>
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Koli</th>
                        <th>Berat (kg)</th>
                        <th>Revenue (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${Customer}</td>
                        <td>${Koli}</td>
                        <td>${Berat}</td>
                        <td>${formatRupiah(Revenue)}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    // Fungsi untuk merender kalender
    fetchForecastData().then(events => {
        console.log("Processed events for calendar:", events); // Debug log event yang diproses

        try {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth', // Tampilan default
                events: events, // Data event
                eventClick: function (info) {
                    console.log("Event clicked:", info.event); // Debug log event yang diklik
                    const detailHTML = createDetailTable(info.event); // Buat tabel detail
                    modalContentEl.innerHTML = detailHTML; // Masukkan ke dalam modal
                    modalEl.style.display = 'block'; // Tampilkan modal
                }
            });

            calendar.render(); // Render kalender di halaman
            console.log("Calendar rendered successfully"); // Debug log
        } catch (error) {
            console.error("Error rendering calendar:", error);
        }
    }).catch(error => {
        console.error("Error during event processing:", error);
    });

    // Event listener untuk menutup modal
    closeModalEl.addEventListener('click', function () {
        modalEl.style.display = 'none'; // Sembunyikan modal saat tombol close diklik
    });
});
