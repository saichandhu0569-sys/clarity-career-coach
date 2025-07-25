import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Star, 
  TrendingUp, 
  Target,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Heart
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { cn } from '@/lib/utils';

interface ResumeDetailsProps {
  resume: ResumeData;
}

export const ResumeDetails: React.FC<ResumeDetailsProps> = ({ resume }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-success';
    if (rating >= 6) return 'text-warning';
    return 'text-destructive';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 8) return 'bg-success';
    if (rating >= 6) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="shadow-card border-2 border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center">
                <User className="h-6 w-6 mr-2 text-primary" />
                {resume.name || 'Name not found'}
              </CardTitle>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {resume.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {resume.email}
                  </div>
                )}
                {resume.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {resume.phone}
                  </div>
                )}
                {resume.linkedin_url && (
                  <div className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-1" />
                    <a href={resume.linkedin_url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
                {resume.portfolio_url && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <a href={resume.portfolio_url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className={cn("text-3xl font-bold", getRatingColor(resume.resume_rating))}>
                {resume.resume_rating}/10
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1" />
                Resume Score
              </div>
              <Progress 
                value={resume.resume_rating * 10} 
                className="w-24 h-2 mt-2"
              />
            </div>
          </div>
        </CardHeader>
        {resume.summary && (
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">{resume.summary}</p>
          </CardContent>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Work Experience */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume.work_experience.length > 0 ? (
              resume.work_experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4 pb-4">
                  <h4 className="font-semibold">{exp.role}</h4>
                  <p className="text-sm text-primary font-medium">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mb-2">{exp.duration}</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No work experience found</p>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume.education.length > 0 ? (
              resume.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-primary font-medium">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">{edu.graduation_year}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No education information found</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-primary" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resume.technical_skills.length > 0 ? (
                resume.technical_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No technical skills found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-primary" />
              Soft Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resume.soft_skills.length > 0 ? (
                resume.soft_skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-primary/30 text-primary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No soft skills found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects & Certifications */}
      {(resume.projects.length > 0 || resume.certifications.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {resume.projects.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resume.projects.map((project, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {resume.certifications.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-semibold">{cert.name}</h4>
                    <p className="text-sm text-primary font-medium">{cert.issuer}</p>
                    {cert.date && (
                      <p className="text-xs text-muted-foreground">{cert.date}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* AI Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card border-2 border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <TrendingUp className="h-5 w-5 mr-2" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{resume.improvement_areas}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-2 border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center text-success">
              <Star className="h-5 w-5 mr-2" />
              Upskilling Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resume.upskill_suggestions.map((suggestion, index) => (
                <Badge key={index} variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};