cd /root/web-sites/leads/ && \
  docker-compose down && \
  docker rmi leads_nextjs -f && \
  docker volume rm leads_build_next leads_leadsnext_nodemodules && \
  rm -rf /root/web-sites/leads/leads_frontend/node_modules && \
  rm -rf /root/web-sites/leads/leads_frontend/.next && \
  cd /root/web-sites/leads/leads_frontend/ && \
  git pull && \
  cd /root/web-sites/leads/ && \
  docker-compose up -d