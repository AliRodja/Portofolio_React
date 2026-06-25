import Container from "../../ui/Container";

function Quote() {
  return (
    <section className="py-32">

      <Container>

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl md:text-6xl font-light leading-tight text-slate-900 italic">

            "Building digital solutions
            <br />
            while growing as a leader."

          </h2>

          <p className="mt-10 text-slate-500 tracking-widest uppercase">

            — Ali Imran Rodja

          </p>

        </div>

      </Container>

    </section>
  );
}

export default Quote;