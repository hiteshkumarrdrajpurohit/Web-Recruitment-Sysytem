package com.sunbeam.entity;



import java.util.ArrayList;
import java.util.List;

import com.sunbeam.entity.types.ApplicationStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "applications")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)

public class Application  extends BaseEntity{
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id", nullable = false)
    private Vacancy vacancy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status; // SUBMITTED, UNDER_REVIEW, SHORTLISTED, INTERVIEWED, REJECTED, SELECTED
    @Column(columnDefinition = "TEXT")
    private String coverLetter;
    
    @Column
    private String resumeFileName;
    
    @Column
    private String resumeFilePath;
    
    @OneToMany(mappedBy = "application", 
			cascade = CascadeType.ALL, orphanRemoval = true)

    private List<Interview> interviewList = new ArrayList<>();
    
}
