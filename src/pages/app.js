import { useState, useEffect, useMemo, useCallback } from "react";

import Head from "next/head";
import Link from "next/link";

import { Card, CardContent, Box, Typography, Grid } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

import { DashboardLayout } from "src/components/dashboard-layout";

import LocalStorageService from "src/utils/browser-storage/local";
import dynamic from "next/dynamic";




const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& main": {
        marginTop: theme.spacing(3),
        "& .project-card": {
          "& .title": {
            marginBottom: theme.spacing(2),
          },
        },
        "& .new-card": {
          border: "2px dashed #ccc",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          "& .new": {
            padding: "auto",
          },
        },
      },
    },
  })
);

const Projects = () => {
  const classes = useStyles();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const lsInstance = new LocalStorageService();
    setProjects(lsInstance.getItem("projects") || []);
  }, []);

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <Box className={classes.root}>
        <Typography variant="h3">Saved Projects</Typography>
        <main>
          <Grid container spacing={3}>
            {projects.map((project, index) => (
              <Grid key={index} item sm={3}>
                <Card className="project-card" variant="outlined">
                  <CardContent>
                    <Typography className="title" variant="h5" component="div">
                      {project.name}
                    </Typography>
                    <Typography className="content" color="text.secondary">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item sm={3}>
              <Link href="/sandbox" passHref>
                <Card className="project-card new-card" variant="outlined">
                  <CardContent>
                    <Typography className="new" variant="h5" color="text.secondary">
                      +
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </main>
      </Box>
    </>
  );
};

Projects.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Projects;
