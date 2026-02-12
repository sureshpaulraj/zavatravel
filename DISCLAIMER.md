# Agents League Repository Disclaimer

## Protecting Confidential Content and Submissions

### Important Notice to All Contributors

This disclaimer governs your use of the Agents League public GitHub repository. By submitting content, code, or materials to this repository, you acknowledge and agree to these terms. The Agents League is a high-energy developer challenge showcasing agentic AI across GitHub Copilot, Microsoft Foundry, and M365 Agents Toolkit. Submissions are made to a public repository accessible worldwide. Contributors must ensure compliance with all applicable policies, protect confidential information, and understand their responsibilities regarding intellectual property and liability. Failure to comply may result in content removal, disqualification from the challenge, or other appropriate actions. Please read this disclaimer carefully before making any submissions.

---

## Prohibited Content and Confidential Information Protection

Contributors must **never upload confidential, proprietary, or sensitive information** to the Agents League public repository. Prohibited content includes:

- Microsoft Confidential or Highly Confidential information
- Internal engineering projects not approved for open source
- Customer data or personally identifiable information (PII)
- Credentials, API keys, passwords, tokens, or secrets
- Proprietary algorithms or trade secrets
- Pre-release product information under NDA

GitHub Secret Protection scans repositories for over 300 token types and provides push protection to prevent secret commits. All submissions must contain **only General-level information** suitable for public release. Contributors are responsible for reviewing their code and removing any sensitive data before submission. Organizations should implement secret scanning and establish review processes before allowing public repository contributions.

### Security Risk Assessment

The following chart illustrates the relative security risk levels associated with different categories of prohibited content:

| Content Type | Risk Level | Impact |
|--------------|------------|---------|
| **Credentials and Secrets** | 🔴 Critical | Immediate security breaches, unauthorized access |
| **Customer PII** | 🟠 High | Compliance violations, privacy breaches |
| **Proprietary Code** | 🟠 High | Intellectual property theft, competitive disadvantage |
| **Pre-release Information** | 🟡 Medium | NDA violations, competitive intelligence leaks |
| **Internal Documentation** | 🟡 Medium | Confidentiality breaches, policy violations |

---

## Intellectual Property Rights and Licensing

By submitting content to the Agents League repository, contributors grant Microsoft and the community specific rights while retaining certain protections. All submissions must be the contributor's original work or properly licensed for public use.

### Rights and Licensing Terms

| Rights Category | Contributor Retains | Microsoft Receives | Community Receives |
|-----------------|---------------------|--------------------|--------------------|
| **Ownership** | Original work copyright and authorship | Non-exclusive usage rights | Access under open source license |
| **Usage Rights** | Right to reuse in other projects | Right to operate Agents League program | Right to fork, modify, and distribute |
| **License Grant** | Can license elsewhere independently | Perpetual, worldwide, royalty-free license | Rights per repository LICENSE file |
| **Modification Rights** | Can modify own original work | Can adapt submissions for platform needs | Can create derivative works per license |
| **Distribution** | Can distribute original independently | Can distribute as part of Agents League | Can redistribute per license terms |

Contributors represent and warrant they have all necessary rights, licenses, and permissions for submitted materials. Submissions become subject to the repository's open source license as specified in the LICENSE file. Contributors retain ownership of their original work but grant Microsoft a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute submissions for operating the Agents League program. The repository follows Microsoft's Contributor License Agreement (CLA) process to protect both contributors and Microsoft.

Contributors must not submit content that:
- Infringes third-party intellectual property rights
- Violates patents or copyrights
- Contains proprietary information belonging to employers or other entities without authorization

---

## Security Best Practices for Repository Contributions

Contributors must implement security best practices before submitting to the Agents League repository:

### Account Security
- ✅ Enable two-factor authentication (2FA) on GitHub accounts
- ✅ Store recovery codes securely
- ✅ Use GitHub Personal Access Tokens instead of passwords
- ✅ Revoke tokens when no longer needed

### Code Security
- ✅ Never commit credentials, keys, or secrets to any Git repository
- ✅ Use environment variables or secure vaults instead of hardcoded secrets
- ✅ Review Git commit history to ensure no sensitive information was accidentally included
- ✅ Scan code with secret detection tools before pushing to public repositories

### Configuration Security
- ✅ Configure Git clients to use corporate email addresses for commits
- ✅ Enable GitHub Secret Protection for push protection that blocks commits containing detected secrets
- ✅ Organizations can enforce secret protection across all repositories through customizable policies

### Best Practices
- ✅ Review the Microsoft Social Media Guidelines and Open Source Code of Conduct before participating
- ✅ GitHub Secret Protection provides delegated bypass approvals for false positives

---

## Contributor Responsibilities and Requirements

Contributors must fulfill specific responsibilities when submitting to the Agents League repository:

### Compliance Requirements
- ✅ Verify all submissions comply with Microsoft Open Source GitHub Guidelines and these disclaimer terms
- ✅ Ensure submissions contain only General-level, non-confidential information approved for public release
- ✅ Review and remove any sensitive data, credentials, internal references, or proprietary information before submission

### Account Management
- ✅ Provide accurate and complete information when creating accounts
- ✅ Maintain professional GitHub profiles
- ✅ Accept and sign the Microsoft Contributor License Agreement (CLA) as required
- ✅ Maintain security of GitHub accounts through 2FA and secure password practices

### Community Standards
- ✅ Follow the repository's Code of Conduct and engage respectfully with the community
- ✅ Respond promptly to any security concerns or content removal requests from repository maintainers

### Evaluation Understanding
- ✅ Understand that submissions may be used to evaluate projects for the Agents League competition using criteria including accuracy, reasoning, creativity, user experience, and reliability
- ✅ Acknowledge that Microsoft may delete, modify, or remove submissions that violate these terms without prior notice
- ✅ Contributors remain responsible for all activity under their accounts and must notify Microsoft immediately of unauthorized access

---

## Enforcement and Content Removal

Microsoft reserves the right to monitor, review, and remove content from the Agents League repository to ensure compliance with these terms.

### Content Removal Criteria

Repository maintainers may remove content that:
- Contains confidential information
- Violates intellectual property rights
- Includes prohibited materials
- Poses security risks
- Breaches the Code of Conduct

### Enforcement Actions

Contributors found violating these terms may face consequences including:
- Immediate content removal without notice
- Disqualification from Agents League evaluation and prizes
- Revocation of repository access and organization membership
- Reporting to appropriate authorities for serious violations

### Security Response

- GitHub Secret Protection partner program enables automated notifications to service providers when their credentials are exposed
- Partners can validate and revoke compromised secrets
- Microsoft may comply with governmental, court, and law enforcement requests relating to repository content
- Microsoft reserves the right to report information to law enforcement

### Repository Management

- Organization administrators can remove collaborators at any time to enforce security recommendations or guidelines
- Private repositories created for Agents League preparation must be made public within 90 days or risk deactivation
- The enforcement process prioritizes transparency while protecting the security and integrity of the repository and broader community

---

## Questions or Concerns?

If you have questions about this disclaimer or need to report a security concern:

1. Review the repository's [SECURITY.md](SECURITY.md) file for security reporting procedures
2. Check the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community guidelines
3. Refer to the [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

By submitting content to the Agents League repository, you confirm that you have read, understood, and agree to abide by all terms in this disclaimer.

---

*Last Updated: February 2026*
