import React from 'react';
import { Typography, Container, Box, Divider, Paper } from '@mui/material';
import { Helmet } from 'react-helmet';

const Section = ({ title, children }) => (
  <Box mb={4}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    {children}
  </Box>
);

const ListItem = ({ children }) => (
  <Typography variant="body1" component="li" sx={{ mb: 1 }}>
    {children}
  </Typography>
);

const EmployersTermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Home: BookMyWorker</title>
        <link rel="canonical" href={`https://www.bookmyworkers.com/terms`} />
      </Helmet>
      <Box id="terms" component="section" sx={{ py: 8, backgroundColor: '#fafafa' }}>
        <Container
          maxWidth={false}
          disableGutters
          data-aos="fade-up"
          data-aos-delay="100"
          sx={{
            px: { xs: 1, sm: 2, md: 3 }, // Optional: small side padding if you don’t want content touching edges
          }}
        >
          {' '}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Terms and Conditions
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Effective Date: 01-05-2025
              <br />
              Platform: BookMyWorker
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              These terms apply to all employers who register on BookMyWorker to hire skilled or
              unskilled workers through our verified Worker Service Agents. By registering and using
              our services, you agree to the following:
            </Typography>

            <Section title="1. Registration and Account Use">
              <ul>
                <ListItem>
                  Employers must provide accurate and complete details during registration.
                </ListItem>
                <ListItem>Only authorized persons should use the employer account.</ListItem>
                <ListItem>
                  We reserve the right to approve, suspend, or terminate any account if found
                  violating terms.
                </ListItem>
              </ul>
            </Section>

            <Section title="2. Job Posting and Worker Hiring">
              <ul>
                <ListItem>
                  Employers can post job requirements and request workers as per their needs.
                </ListItem>
                <ListItem>
                  Job details (work type, timing, payment, location) must be clear, honest, and
                  legal.
                </ListItem>
                <ListItem>
                  Worker assignments will be made through registered Worker Service Agents.
                </ListItem>
              </ul>
            </Section>

            <Section title="3. Payment and Charges">
              <ul>
                <ListItem>Employers must pay:</ListItem>
                <ul>
                  <ListItem>Workers’ wages on time, as agreed before work begins.</ListItem>
                  <ListItem>
                    Any platform or service agent fees as communicated before hiring.
                  </ListItem>
                </ul>
                <ListItem>
                  Delayed or non-payment may lead to account suspension or legal action.
                </ListItem>
              </ul>
            </Section>

            <Section title="4. Work Environment and Conduct">
              <ul>
                <ListItem>Employers must provide:</ListItem>
                <ul>
                  <ListItem>Safe, legal, and respectful working conditions.</ListItem>
                  <ListItem>
                    Basic facilities required for the type of work (if applicable).
                  </ListItem>
                </ul>
                <ListItem>Harassment, abuse, or discrimination is strictly prohibited.</ListItem>
              </ul>
            </Section>

            <Section title="5. Cooperation with Worker Service Agents">
              <ul>
                <ListItem>
                  Employers must coordinate with assigned service agents for worker selection,
                  onboarding, and issue resolution.
                </ListItem>
                <ListItem>
                  Any concerns about workers should be first raised with the assigned agent.
                </ListItem>
              </ul>
            </Section>

            <Section title="6. Cancellations and Job Changes">
              <ul>
                <ListItem>If a job needs to be cancelled or changed, employers must:</ListItem>
                <ul>
                  <ListItem>Notify the service agent at the earliest.</ListItem>
                  <ListItem>Provide a valid reason for cancellation.</ListItem>
                </ul>
                <ListItem>
                  Repeated or unfair cancellations may lead to platform restrictions.
                </ListItem>
                <ListItem>All services are non refundable.</ListItem>
              </ul>
            </Section>

            <Section title="7. Responsibility and Liability">
              <ul>
                <ListItem>
                  BookMyWorker is only a connecting platform and does not act as an employer.
                </ListItem>
                <ListItem>We are not liable for:</ListItem>
                <ul>
                  <ListItem>Work performance, loss, or injury during the job.</ListItem>
                  <ListItem>
                    Any disputes between employers and workers, though we will assist in resolution.
                  </ListItem>
                </ul>
              </ul>
            </Section>

            <Section title="8. Data Privacy">
              <ul>
                <ListItem>
                  Employer data will be kept confidential and used only for service-related
                  purposes.
                </ListItem>
                <ListItem>
                  Employers are also responsible for maintaining the privacy of workers’
                  information.
                </ListItem>
              </ul>
            </Section>

            <Section title="9. Termination or Suspension">
              <ul>
                <ListItem>Employer accounts may be suspended or removed for:</ListItem>
                <ul>
                  <ListItem>Violating platform policies.</ListItem>
                  <ListItem>Non-payment or misuse of services.</ListItem>
                  <ListItem>Unsafe or unethical treatment of workers.</ListItem>
                </ul>
              </ul>
            </Section>

            <Section title="10. Legal Compliance">
              <ul>
                <ListItem>
                  Employers agree to follow all applicable labor laws and local employment
                  regulations.
                </ListItem>
                <ListItem>
                  Any disputes or legal matters will be subject to the jurisdiction of Rewa, Madhya
                  Pradesh.
                </ListItem>
              </ul>
            </Section>

            <Section title="11. Updates to Terms">
              <ul>
                <ListItem>BookMyWorker may change these terms at any time.</ListItem>
                <ListItem>
                  Employers will be informed of major updates, and continued use means acceptance of
                  new terms.
                </ListItem>
                <ListItem>BookMyWorker Is managed by BookMyWorker.</ListItem>
              </ul>
            </Section>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default EmployersTermsPage;
