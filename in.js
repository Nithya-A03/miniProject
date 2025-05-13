const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const chalk = require('chalk'); // Make sure chalk@4 is installed
const cliProgress = require('cli-progress');

// ✅ Define skills to match
const SKILLS = ['JavaScript', 'Node.js', 'Python', 'React', 'HTML', 'CSS', 'Express', 'MongoDB', 'SQL', 'TypeScript'];

// ✅ Parse PDF
const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// ✅ Analyze skills
const analyzeResume = (text) => {
  const matched = SKILLS.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
  const percentage = Math.round((matched.length / SKILLS.length) * 100);
  return { matched, percentage };
};

// ✅ Display results
const displayResults = ({ matched, percentage }) => {
  console.log(chalk.green.bold('\n=== Resume Analyzer ==='));

  if (matched.length > 0) {
    console.log(chalk.blue('Matched Skills:'), chalk.yellow(matched.join(', ')));
  } else {
    console.log(chalk.red('No matching skills found.'));
  }

  // Show progress bar
  const bar = new cliProgress.SingleBar({
    format: `Match Score |${chalk.cyan('{bar}')}| {percentage}%`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });

  bar.start(100, 0);
  bar.update(percentage);
  bar.stop();

  console.log(chalk.magenta(`\nResume Score: ${percentage}%`));
};

// ✅ Main function
const processResume = async (filePath) => {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`❌ File not found: ${filePath}`));
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  let content = '';

  if (ext === '.pdf') {
    content = await parsePDF(filePath);
  } else {
    console.log(chalk.red('❌ Unsupported file type. Only PDFs are allowed.'));
    return;
  }

  const result = analyzeResume(content);
  displayResults(result);
};

// ✅ Change this to your actual file
const filePath = 'resume.pdf';
processResume(filePath).catch(err => console.error(chalk.red(err)));
