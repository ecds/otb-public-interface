const AboutOTB = () => {
  return (
    <div>
      <h3>About OpenTour</h3>
      <p>
        OpenTour Builder is an open source software platform for building
        geospatial tours that are optimized for mobile devices. OpenTour Builder
        continues to be developed by the{" "}
        <a href="https://digitalscholarship.emory.edu/index.html">
          Emory Center for Digital Scholarship
        </a>
        , who began development of the web app in 2014 in its first iteration.
        The current version of OpenTour Builder, v. 3.0, was launched in March
        of 2019, and continues to be improved.
      </p>
      <p>
        With this tool, tour builders can easily create interactive, attractive
        tours that guide users from stop to stop using their smartphone's GPS
        and OpenTour Builder's native Google Maps instructions. At each
        location, the designer can include images, video, text, and external
        links to provide historical and cultural context, tying that information
        to the physical space.
      </p>
      <p>
        An Emory-supported instance of{" "}
        <a href="https://opentour.site/">OpenTour</a> is now available for those
        who intend to use the technology for educational purposes or the
        exhibition of research. Tours need to fit within the ECDS and Emory
        mission. The Emory Center for Digital Scholarship supports partnerships,
        both with Emory community members and with outside interested parties.
        If you are interested in a partnership to use OpenTour, please contact
        us at ecds@emory.edu. You can find more information on the{" "}
        <a href="https://digitalscholarship.emory.edu/expertise/projects/open-tour-builder.html">
          ECDS OpenTour Page
        </a>
        .
      </p>
      <section className="p-12">
        <img
          src="/images/emory-center-for-digital-scholarship-logo-rev.svg"
          role="presentation"
          alt=""
        />
      </section>
    </div>
  );
};

export default AboutOTB;
