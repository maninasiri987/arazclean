/**
 * لودر اولیهٔ سایت — فقط استایل‌های inline (بدون Tailwind) تا
 * حتی قبل از بارگذاری CSS هم همین‌طور که هست بدون نقص رندر شود
 * و دقیقاً همان طراحی اسپینر استاتیک index.html را تکرار کند.
 */
export default function BootLoader() {
  return (
    <>
      <div
        role="status"
        aria-label="در حال بارگذاری"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            aria-hidden="true"
            className="boot-spinner-inline"
            style={{
              boxSizing: "border-box",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "4px solid rgb(14 165 164 / 0.15)",
              borderTopColor: "#0ea5a4",
              animation: "boot-spin 0.9s linear infinite",
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes boot-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .boot-spinner-inline {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}