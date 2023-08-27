import Link from "next/link";

function Page404() {
  return (
    <section className="grid h-screen w-full place-content-center">
        <div className="text-center">
          <h1 className="text-center text-4xl font-bold">404</h1>
          <div
            className="four_zero_four_bg"
            style={{
              backgroundImage:
                "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
              height: "400px",
              backgroundPosition: "center",
            }}
          />

          <div className="contant_box_404">
            <h3 className="text-2xl font-semibold mb-1">Look like you are lost</h3>
            <p>The page you are looking for is not available!</p>
            <Link href="/dashboard" className="btn mt-4 btn-primary text-white">

              Go to Dashboard
            </Link>
          </div>
        </div>
    </section>
  );
}

export default Page404;
